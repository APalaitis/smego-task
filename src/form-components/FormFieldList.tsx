import * as React from 'react'
import './FormFieldList.scss'
import { FieldConfigActions, FormContext, FormFieldDefinition, FormState } from './useForm'
import { InputWrapper } from './input-components/InputWrapper'

interface FormFieldListProps {
    formFields: FormFieldDefinition<any>[]
    formState: FormState
}

export const FormFieldList: React.FC<FormFieldListProps> = props => {
    const {triggerValidation, formFieldsReducerAction} = React.useContext(FormContext)!
    const [submitted, setSubmitted] = React.useState<string[]>()
    
    const submitForm = () => {
        setSubmitted(undefined)
        triggerValidation()
        const formFieldNames = Object.keys(props.formState)
        if (!formFieldNames.some(key => !props.formState[key].valid)) {
            setSubmitted(formFieldNames.map(key => `${key}: ${props.formState[key].value}`))
        }
    }
    
    const onDelete = (field: FormFieldDefinition<any>) => () => {
        formFieldsReducerAction({type: FieldConfigActions.deleteFormItem, payload: {name: field.name}})
    }
    
    return (
        <div className="form-fields">
            <h2>Form</h2>
            {props.formFields.map(field => (
                <InputWrapper
                    key={field.name}
                    fieldDef={field}
                    fieldState={props.formState[field.name]}
                    onDelete={onDelete(field)}
                >
                    <field.component
                        name={field.name}
                        validate={field.validation}
                        {...field.additionalProps}
                    />
                </InputWrapper>
            ))}
            <button onClick={submitForm}>Submit</button>
            {!submitted ? null : (
                <div className='submit-result'>
                    <div>Form successfully submitted!</div>
                    {submitted.map((line, index) => (
                        <div key={index}>{line}</div>
                    ))}
                </div>
            )}
        </div>
    )
}