import fire from "../../fireInit"
import store from '../store'

export function login(email, pass) {
    fire.auth().signInWithEmailAndPassword(email, pass).then(user => {
        if (user) {
            store.dispatch({
                type: "USER_LOGGED_IN",
            });
        }
    }).catch(error => store.dispatch({ type: "ERROR_LOGGING_IN" }))
}

export function logout() {
    store.dispatch({
        type: "USER_LOGGED_OUT",
    });
}