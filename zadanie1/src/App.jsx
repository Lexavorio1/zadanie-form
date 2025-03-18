import { useState } from 'react'
import styles from './App.module.css'

const initialState = {
  login: '',
  email: '',
  password: '',
}
const initialError = {
  loginError: null,
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
const loginRegex = /^[a-zA-Z0-9_-]{3,16}$/
const passwordRegex =  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/

export const App = () => {
  const {getState, getError, updateState, updateError, resetState} = useStore()

  const onSubmit = (event) => {
    event.preventDefault()
    console.log('onSubmit called')
    if (loginError || emailError || passwordError) {
      return;
    }
    sendData(getState)
  }

  const sendData = (formData) => {
    console.log(formData)
  }

  const { emailError, loginError, passwordError } = getError()
  const { email, login, password } = getState()


  const onChange = ({ target }) => { 
    updateState(target.name, target.value)
    switch (target.name) {
      case 'login':{
        const loginValid = loginRegex.test(target.value)
        loginValid ? updateError('loginError', null) : updateError('loginError', 'Логин должен от 3 до 16 символов, буквы, цифры, подчеркивания, тире')
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
  }

  return (
    <div className={styles.app}>
      <h1>Регистрация</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles['other-input']}>
          <input className={`${styles['input-login']} ${styles.input}`}
            name="login"
            type="text"
            value={login}
            onChange={onChange}
            placeholder="Логин"
          />
          <input className={`${styles['input-email']} ${styles.input}`}
            name="email"
            type="text"
            value={email}
            onChange={onChange}
            placeholder="Почта"
          />
        </div>
        <input className={`${styles['input-password']} ${styles.input}`}
          name="password"
          type="password"
          value={password}
          onChange={onChange}
          placeholder="Пароль"
        />
      </form>
      <div className={styles.btns}>
        <button 
         className={styles['glow-on-hover']}
         type="submit" 
         disabled={loginError !== null || emailError !== null || passwordError !== null}
         >
          Зарегистрироваться
        </button>
        <button className={styles['glow-on-hover']} onClick={resetState}>Сброс</button>
      </div>
      <div>
      {loginError && <div className={styles.errorLabel}>{loginError}</div>}
      {emailError && <div className={styles.errorLabel}>{emailError}</div>}
      {passwordError && (<div className={styles.errorLabel}>{passwordError}</div>)}
      </div>
    </div>
  )
}