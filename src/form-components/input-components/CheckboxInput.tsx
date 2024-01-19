import * as React from 'react'
import { GenericInputProps, useGenericInput } from './useGenericInput'

export interface CheckboxInputProps extends GenericInputProps {
    checkboxText: string
}

export const CheckboxInput: React.FC<CheckboxInputProps> = props => {
    const {state, handleChangeEvent, handleBlurEvent, inputProps} = useGenericInput<HTMLInputElement>({
        // Checkbox input values are store in 'target.checked' rather than 'target.value', so we need to override the default behaviour.
        valueFromEvent: (e: React.ChangeEvent<HTMLInputElement>) => {
            return e.target.checked
        },
        defaultValue: false,
        ...props
    })

    return (
        <div className="checkbox-wrapper">
            <input
                {...inputProps}
                type='checkbox'
                name={props.name}
                checked={state.value}
                onChange={handleChangeEvent}
                onBlur={handleBlurEvent}
            />
            <label htmlFor={props.name}>{props.checkboxText ?? 'Checkbox'}</label>
        </div>
    )
}