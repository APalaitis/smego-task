import * as React from 'react'
import classNames from 'classnames'
import { FormFieldDefinition } from '../useForm'
import { GenericInputState } from './useGenericInput'
import { Callback } from '../types'

interface InputWrapperProps extends React.PropsWithChildren {
    fieldDef: Partial<FormFieldDefinition<any>>
    fieldState?: GenericInputState
    onDelete?: Callback
}

export const InputWrapper: React.FC<InputWrapperProps> = ({children, fieldDef, fieldState, onDelete}) => {
    const hasErrors = (fieldState?.valid === false) && fieldState?.dirty
    
    return (
        <div className={classNames('form-field-wrapper', {error: hasErrors})}>
            <label htmlFor={fieldDef.name}>{fieldDef.label ?? fieldDef.name}</label>
            <div className='form-field-wrapper-children'>
                {children}
                {!onDelete ? null : (
                    <button onClick={onDelete}>Delete field</button>
                )}
            </div>
            {!hasErrors ? null : (
                <div className='error-message'>
                    {fieldState?.errorMessage}
                </div>
            )}
        </div>
    )
}