import * as React from 'react'
import { GenericInputProps, useGenericInput } from './useGenericInput'

export interface TextInputProps extends GenericInputProps {}

export const TextInput: React.FC<TextInputProps> = props => {
    const {state, handleChangeEvent, handleBlurEvent, inputProps} = useGenericInput<HTMLInputElement>({
        defaultValue: '',
        ...props
    })

    return (
        <input
            {...inputProps}
            type="text"
            name={props.name}
            value={state.value}
            onChange={handleChangeEvent}
            onBlur={handleBlurEvent}
        />
    )
}