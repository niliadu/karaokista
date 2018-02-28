import store from '../store'

export function setCurrentAdminView(view){
    store.dispatch({
        type: "CURRENT_VIEW_SET",
        value: view
    });
}