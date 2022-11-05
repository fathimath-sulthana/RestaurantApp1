import { SET_USER } from "./actions";

const initialSate = {
    user: null
}

function userReducer(state = initialSate, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

export default userReducer;


let defaultState = {
    // orders with cafeName as Key and list of items as a value
    selectedItems: { items: [] },
    };
    
    let cartReducer = (state = defaultState, action) => {
     switch (action.type) {
       case "ADD_TO_CART": {
       let newState = { ...state };
       cafeName = action.payload.cafeName;
    
      if (action.payload.checkboxValue) {
        console.log("ADD TO CART");
    
        newState.selectedItems = {
          items: [...newState.selectedItems.items, action.payload],
        };
      } else {
        console.log("REMOVE FROM CART");
        newState.selectedItems = {
          items: [
            ...newState.selectedItems.items.filter(
              (item) => item.name !== action.payload.name
            ),
          ],
        };
      }
    
      console.log(newState);
      return newState;
     }
    
      default:
        return state;
       }
      };
    
     



