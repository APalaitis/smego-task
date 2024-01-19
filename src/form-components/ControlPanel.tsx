import * as React from 'react'
import './ControlPanel.scss'
import { FieldConfigActions, FormContext, FormFieldDefinition, FormState } from './useForm'
import { TextInput } from './input-components/TextInput'
import { SelectInput } from './input-components/SelectInput'
import { GenericInputState } from './input-components/useGenericInput'
import { InputWrapper } from './input-components/InputWrapper'

interface ControlPanelProps {
    formState: FormState
    formFields: FormFieldDefinition<any>[]
}

export const ControlPanel: React.FC<ControlPanelProps> = props => {
    const {formFieldsReducerAction} = React.useContext(FormContext)!
    const [name, setName] = React.useState<string>()
    const [type, setType] = React.useState<string>()
    const [error, setError] = React.useState<string>()
    
    const handleFieldStateChange = (name: string, state: GenericInputState) => {
        switch(name) {
            case 'name':
                setName(state.value)
                break
            case 'type':
                setType(state.value)
                break
        }
    }

    const addField = () => {
        if (props.formFields.some(field => field.name === name)) {
            setError('Name already in use')
            return
        }

        if (!name || !type) {
            setError('Name and type required')
            return
        }

        setError(undefined)
        formFieldsReducerAction({
            type: FieldConfigActions.addFormItem,
            payload: {
                name,
                type
            }
        })
    }
    
    return (
        <div className="control-panel">
            <h2>Control Panel</h2>
            <InputWrapper fieldDef={{name: 'name', label: 'Field name'}}>
                <TextInput name='name' fieldStateChange={handleFieldStateChange} />
            </InputWrapper>
            <InputWrapper fieldDef={{name: 'type', label: 'Field type'}}>
                <SelectInput name='type' fieldStateChange={handleFieldStateChange} options={['Text', 'Number', 'Select', 'Checkbox']} />
            </InputWrapper>
            {!error ? null : (
                <div className='error-message'>{error}</div>
            )}
            <button onClick={addField}>Add field</button>
            <pre>{JSON.stringify(props.formState, null, 2)}</pre>
        </div>
    )
}