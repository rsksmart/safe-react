import * as React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

import TextField from 'src/components/forms/TextField'
import { composeValidators, mustBeEthereumAddress, required } from 'src/components/forms/validator'
import { getAddressFromRNS } from 'src/logic/wallets/getWeb3'

const isValidRnsName = (name) => /^([\w-]+\.)+(rsk)$/.test(name)

// an idea for second field was taken from here
// https://github.com/final-form/react-final-form-listeners/blob/master/src/OnBlur.js

const AddressInput = ({
  className = '',
  name = 'recipientAddress',
  text = 'Recipient*',
  placeholder = 'Recipient*',
  fieldMutator,
  testId,
  inputAdornment,
  validators = [],
  defaultValue,
  disabled,
}: any) => (
  <>
    <Field
      className={className}
      component={TextField as any}
      defaultValue={defaultValue}
      disabled={disabled}
      inputAdornment={inputAdornment}
      name={name}
      placeholder={placeholder}
      testId={testId}
      text={text}
      type="text"
      validate={composeValidators(required, mustBeEthereumAddress, ...validators)}
    />
    <OnChange name={name}>
      {async (value) => {
        if (isValidRnsName(value)) {
          try {
            const resolverAddr = await getAddressFromRNS(value)
            fieldMutator(resolverAddr)
          } catch (err) {
            console.error('Failed to resolve address for RNS name: ', err)
          }
        }
      }}
    </OnChange>
  </>
)

export default AddressInput
