const initialState = {
    userToken: '',
    infoUser: null,
    allShop: [],
    addressShop: null
  }
  
  // Use the initialState as a default value
  export default function rootReducer(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        case 'NEW_USER':
            return {
                ...state, userToken:action.payload
            };
        case 'STOCK_ADDRESS':
            return  {
                ...state, addressShop: action.payload
            }
        case 'INFO_USER':
            
            return {
                ...state, infoUser:action.payload
            };
        case 'ADD_ITEM':
            let index = state.allShop.some(item => item.id === action.payload.id)

            if(!index) {
                return {...state, allShop:[...state.allShop, action.payload]};
            }
            break;
        case 'UPDATE_SHOP':
            let copy = state.allShop;
            let indexOf = state.allShop.findIndex(elm => elm.id === action.payload.id);
            action.payload.quantity = action.payload.quantity < action.payload.disponibility ? action.payload.quantity + 1 : action.payload.disponibility
            action.payload.prix = action.payload.defaultPrice * action.payload.quantity; 
            copy[indexOf] = action.payload;
            return {
                ...state, allShop:[...copy]
            }
        case 'EMPTY_SHOP':
            return {
                ...state, allShop: []
            }
        case 'UPDATE_SHOP_DOWN':
            let copyDown = state.allShop;
            let indexOfDown = state.allShop.findIndex(elm => elm.id === action.payload.id);
            action.payload.quantity = action.payload.quantity > 0 && action.payload.quantity - 1 
            if(action.payload.quantity === 0) {
                let item = state.allShop.filter(elm => elm.id !== action.payload.id);
                return {
                    ...state, allShop: [...item]
                }
            }
            action.payload.prix = action.payload.defaultPrice * action.payload.quantity; 
            copyDown[indexOfDown] = action.payload;
            return {
                ...state, allShop:[...copyDown]
            }
        case 'DELETE_ITEM':
            return {
                ...state, allShop: state.allShop.filter(item => action.payload !== item)
            }
        case 'LOGOUT':
                return {
                    ...state, userToken: ''
                }
      // Do something here based on the different types of actions
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }