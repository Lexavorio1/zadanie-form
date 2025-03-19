import { useRef, useState } from 'react'
import styles from './App.module.css'

const initialState = {
  checkPassword: '',
  email: '',
  password: '',
}
const initialError = {
  checkPasswordError: null,
  emailError: null,
  passwordError: null,
}

const useStore = () => {
  const [state, setState] = useState(initialState)
  const [error, setError] = useState(initialError)

  return {
    getState: () => state,
    getError: () => error,
    updateError: (fieldError, newError) => {
      setError({ ...error, [fieldError]: newError })
    },
    updateState: (fieldName, newValue) => {
      setState({ ...state, [fieldName]: newValue })
    },
    resetState: () => {
      setState(initialState)
      setError(initialError)
    }
  }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex =  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/

export const App = () => {
  const {getState, getError, updateState, updateError, resetState} = useStore()
  const submitButtonRef = useRef(null)

  const onSubmit = (event) => {
    event.preventDefault()
    console.log('onSubmit called')
    if (checkPasswordError || emailError || passwordError) {
      return;
    }
    sendData(getState())
  }

  const sendData = (formData) => {
    console.log(formData)
  }

  const { emailError, passwordError, checkPasswordError } = getError()
  const {  email, password, checkPassword } = getState()


  const onChange = ({ target }) => { 
    updateState(target.name, target.value)
    switch (target.name) {
      case 'checkPassword':{
        const checkPasswordValid = target.value === password
        checkPasswordValid ? updateError('checkPasswordError', null) : 
        updateError('checkPasswordError', 'Неправильный пароль')
        break
      }
      case 'email':{
          const isEmailValid = emailRegex.test(target.value)
          isEmailValid ? updateError('emailError', null) : updateError('emailError', 'Некорректный формат email.')
          break
        }
        case 'password':{
          const isPasswordValid = passwordRegex.test(target.value)
          isPasswordValid ?  updateError('passwordError', null) 
          : updateError('passwordError', 'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ.')
          break
        }
        default:
          break
    }
    if (email !== '' && password !== '' && checkPassword !== '') {
      submitButtonRef.current.focus();
    }
  }

  return (
    <div className={styles.app}>
      <h1>Регистрация</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        
          <input className={`${styles['input-email']} ${styles.input}`}
            name="email"
            type="text"
            value={email}
            onChange={onChange}
            placeholder="Почта"
          />
          <div className={styles['other-input']}>
          <input className={`${styles['input-login']} ${styles.input}`}
            name="password"
            type="password"
            value={password}
            onChange={onChange}
            placeholder="Пароль"
          />
        <input className={`${styles['input-password']} ${styles.input}`}
          disabled={password === ''}
          name="checkPassword"
          type="password"
          value={checkPassword}
          onChange={onChange}
          placeholder="Повтор Пароля"
        />
        </div>
      <div className={styles.btns}>
        <button 
         className={styles['glow-on-hover']}
         ref = {submitButtonRef}
         type="submit" 
         disabled={checkPasswordError !== null || emailError !== null || passwordError !== null}
         >
          Зарегистрироваться
        </button>
        <button className={styles['glow-on-hover']} onClick={resetState}>Сброс</button>
      </div>
      </form>
      <div>
      {checkPasswordError && <div className={styles.errorLabel}>{checkPasswordError}</div>}
      {emailError && <div className={styles.errorLabel}>{emailError}</div>}
      {passwordError && (<div className={styles.errorLabel}>{passwordError}</div>)}
      </div>
    </div>
  )
}