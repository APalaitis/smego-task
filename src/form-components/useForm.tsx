import * as React from 'react'
import { Action, Callback } from './types'
import { TextInput } from './input-components/TextInput'
import { NumberInput } from './input-components/NumberInput'
import { SelectInput } from './input-components/SelectInput'
import { CheckboxInput } from './input-components/CheckboxInput'
import { GenericInputProps, GenericInputState } from './input-components/useGenericInput'

export interface UseFormProps {
    /**
     * List of fields that are displayed on the form by default.
     */
    defaultFields?: FormFieldDefinition<any>[]
}

export interface FormFieldDefinition<T extends GenericInputProps> {
    /**
     * Name/Identifier of the field.
     */
    name: string
    /**
     * Component Implementation to use for the field, e. g. TextInput
     */
    component: React.FC<T>
    /**
     * Field label.
     */
    label?: string
    /**
     * Field validation function.
     * @param value Field value to validate
     * @returns undefined if valid, otherwise - the error message
     */
    validation?: (value: any) => string | undefined
    /**
     * Additional props object to customize some of the form field components.
     */
    additionalProps?: Partial<T>
}

export enum FieldConfigActions {
    /**
     * Add a new item to the form field configuration.
     */
    addFormItem,
    /**
     * Removes an item from the form field configuration.
     */
    deleteFormItem
}

export interface FormState {
    [key: string]: GenericInputState
}

export enum FormStateActions {
    /**
     * Sets the state of a form field.
     */
    setFieldState,
    /**
     * Clears the state of a form field, usually when the field is being deleted.
     */
    clearFieldState
}

export interface FormContextType {
    /**
     * Actions for the form field configuration reducer.
     */
    formFieldsReducerAction: React.Dispatch<Action<FieldConfigActions>>
    /**
     * Actions for the form state manipulation reducer.
     */
    formStateReducerAction: React.Dispatch<Action<FormStateActions>>
    /**
     * Callback to manually trigger a whole form validation.
     */
    triggerValidation: Callback
    /**
     * Used to register field-specific actions that are to be executed when the form validation is triggered.
     * @param name Form field identifier
     * @param callback Code to execute on validation
     */
    registerValidation: (name: string, callback: Callback) => void
    /**
     * Used to register field-specific actions that are to be executed when the form validation is triggered.
     * @param name Form field identifier
     */
    unregisterValidation: (name: string) => void
}

/**
 * Context used in tandem with useForm.
 */
export const FormContext = React.createContext<FormContextType | null>(null)

/**
 * Form initializer hook. Use FormContext to access form controls and methods.
 */
export const useForm = (props: UseFormProps) => {
    let {current: registeredValidationCallbacks} = React.useRef<{[key: string]: Callback}>({})

    const [formState, formStateReducerAction] = React.useReducer((state: FormState, action: Action<FormStateActions>) => {
        switch (action.type) {
            case FormStateActions.setFieldState:
                return {
                    ...state,
                    [action.payload.name]: action.payload.state
                }
            case FormStateActions.clearFieldState:
                const oldState = {...state}
                delete oldState[action.payload.name]
                return oldState
            default:
                return state
        }
    }, {})

    const [formFields, formFieldsReducerAction] = React.useReducer((state: FormFieldDefinition<any>[], action: Action<FieldConfigActions>) => {
        switch (action.type) {
            case FieldConfigActions.addFormItem:
                return [
                    ...state,
                    {
                        name: action.payload.name,
                        // Map text values to component definitions
                        component: {
                            "Text": TextInput,
                            "Number": NumberInput,
                            "Select": SelectInput,
                            "Checkbox": CheckboxInput
                        }[action.payload.type as string] as React.FC,
                        validation: (v: any) => v !== '' ? undefined : 'Required'
                    }
                ]
            case FieldConfigActions.deleteFormItem:
                // Clear the associated state
                formStateReducerAction({type: FormStateActions.clearFieldState, payload: {name: action.payload.name}})
                return state.filter(v => v.name !== action.payload.name)
            default:
                return state
        }
    }, props.defaultFields ?? [])

    const registerValidation = (name: string, callback: Callback) => {
        registeredValidationCallbacks[name] = callback
    }

    const unregisterValidation = (name: string) => {
        delete registeredValidationCallbacks[name]
    }

    const triggerValidation = () => {
        Object.values(registeredValidationCallbacks).forEach(callback => {
            callback()
        })
    }

    const contextValue: FormContextType = React.useMemo(() => ({
        formFieldsReducerAction,
        formStateReducerAction,
        triggerValidation,
        registerValidation,
        unregisterValidation
    }), [])

    // Memoized to prevent infinite rendering
    const ContextProvider: React.FC<React.PropsWithChildren> = React.useCallback(({children}) => (
        <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
    ), [contextValue])

    return {
        /**
         * Mandatory for the functionality of the hook. Make sure to wrap your components in this context component.
         */
        ContextProvider,

        /**
         * State of all the form fields.
         */
        formState,

        /**
         * Configuration of the form fields.
         */
        formFields
    }
}