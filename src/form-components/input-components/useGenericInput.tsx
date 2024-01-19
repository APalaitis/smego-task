import * as React from 'react'
import { FormContext, FormStateActions } from '../useForm'

export interface GenericInputProps {
    /**
     * Field name/identifier.
     */
    name: string
    /**
     * Default value, if any.
     */
    defaultValue?: any
    /**
     * A callback that triggers when the field state changes.
     * @param name Field name/identifier
     * @param state Updated state
     */
    fieldStateChange?: (name: string, state: GenericInputState) => void
    /**
     * Field validation function.
     * @param value Field value to validate
     * @returns undefined if valid, otherwise - the error message
     */
    validate?: (value: any) => string | undefined
    /**
     * Optional function that is used to extract field value from a change event. By default event.target.value is being used.
     * @param event Change event object
     * @returns Field value after the change event
     */
    valueFromEvent?: (event: React.ChangeEvent<any>) => any
}

export interface GenericInputState {
    /** Field value */
    value?: any
    /** True if the field has been touched by the user */
    dirty?: boolean
    /** True if the field value is valid */
    valid?: boolean
    /** Contains error text in case the field is invalid */
    errorMessage?: string
}

/**
 * Initializes a new form field.
 */
export const useGenericInput = <T extends HTMLElement>(props: GenericInputProps) => {
    const {
        name,
        fieldStateChange,
        validate,
        valueFromEvent
    } = props

    const {
        registerValidation,
        unregisterValidation,
        formStateReducerAction
    } = React.useContext(FormContext)!
    
    const [state, setState] = React.useState<GenericInputState>({
        dirty: false,
        value: props.defaultValue
    })

    const inputProps = React.useMemo(() => ({
        className: 'input'
    }), [])

    // Report any changes up the component chain
    React.useEffect(() => {
        fieldStateChange
            ? fieldStateChange(name, state)
            : formStateReducerAction({type: FormStateActions.setFieldState, payload: {name, state}})
    }, [state])

    // Validate if a function is provided, otherwise assume it's valid
    const validateField = () => {
        const errorMessage = validate ? validate(state.value) : undefined
        setState(oldState => ({
            ...oldState,
            valid: !errorMessage,
            errorMessage
        }))
    }

    React.useEffect(() => {
        validateField()
    }, [state.value])

    // ...can also be triggered manually, so we register it with the form
    React.useEffect(() => {
        registerValidation(name, () => {
            setState(oldState => ({
                ...oldState,
                dirty: true
            }))
            validateField()
        })

        // Unregister on destruction
        return () => unregisterValidation(name)
    }, [validateField])
    
    const handleChangeEvent: React.ChangeEventHandler<T & {value: any}> = e => {
        setState(oldState => ({
            ...oldState,
            value: valueFromEvent ? valueFromEvent(e) : e.target.value,
            dirty: true
        }))
    }

    const handleBlurEvent: React.FocusEventHandler<T> = e => {
        setState(oldState => ({
            ...oldState,
            dirty: true
        }))
        validateField()
    }

    return {
        /**
         * State of the form field.
         */
        state,

        /**
         * Callback used to handle field changes.
         */
        handleChangeEvent,

        /**
         * Callback used to handle field blurring.
         */
        handleBlurEvent,

        /**
         * Generic props object for form fields.
         */
        inputProps
    }
}