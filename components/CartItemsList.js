import React ,{useEffect,useState}from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, Alert } from "react-native";
import { COLORS, icons, SIZES, FONTS } from '../constants';
import { CustomButton } from ".";
import { DATABASE_URL } from "../constants"
import RazorpayCheckout from 'react-native-razorpay';
import { firebase } from "@react-native-firebase/database";
import { useSelector } from 'react-redux';


const CartItems = ({ cartItems, getTotal, deleteItem, changeQty, navigation,handlePayment }) => {
    const { user } = useSelector(state => state.userReducer);
    const [orders, setOrders] = useState([])
    const orderReference = firebase.app().database(DATABASE_URL).ref('/Order/');

    useEffect(() => {
        let array = []; 
        if (user) {
            orderReference.on('value', snapshot => {
                snapshot.forEach((cartItems) => {
                    var snapshotItem = cartItems.val();
                    if (snapshotItem != null && snapshotItem.uid == user.uid) {
                        array.push(snapshotItem)
                    }
                })
              setOrders(array)
                array = [];
            });
        } else
      setOrders([])
    }, [user]);
  
   function  removeItem () {
     firebase.app().database(DATABASE_URL).ref('/Cart/' ).remove();
      

    }
     
   handlePayment = (name) => {
        var options = {
          name: 'Inmakes',
          description: 'for test payment',
          currency: 'INR',
          amount: getTotal()*100,
          key: 'rzp_test_EPFelEqBaAykvp',
          prefill: {
            // email: 'av@gmail.com',
            // contact: '9191919191',
            // name: 'Vinay',
          },
          theme: {color: '#f37251'},
        };
        RazorpayCheckout.open(options)
          .then(data => {
            console.log('data', data);
            Alert.alert(
                'order placed successfully',
                'thank you!',
                [
                  {text: 'ok', onPress: () => removeItem()},

                ],
                console.log(cartItems)
              )
             navigation.navigate('Order')
          
              })
          .catch(error => {
            Alert.alert(error);
          });
      
  }



    const renderItem = ({ item }) => {

        return (

            <TouchableOpacity style={styles.container}
                onPress={() => {
                    navigation.navigate('Restaurant', {
                        currentItem: item, currentCategory: item.category
                    });
                }}>

                {/* Image */}
                <Image
                    source={{ uri: item.photoUrl }}
                    resizeMode='contain'
                    style={styles.image} />

                {/* Name & Price */}
                <View
                    style={styles.name_price_container}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>Rs. {item.price}</Text>

                    {/* Delete Image */}
                    <TouchableOpacity style={styles.delete} onPress={() => deleteItem(item.name)}>
                        <Image
                            source={icons.dlt}
                            resizeMode='contain'
                            style={{
                                height: 40,
                                width: 40,
                                tintColor: 'red'
                            }} />
                    </TouchableOpacity>

                    <View style={styles.qty_container}>
                        {/* decrease qty */}
                        <TouchableOpacity style={styles.decrease_qty}
                            onPress={() => { changeQty(item, '-') }}>
                            <Text style={styles.change_qty_text}>-</Text>
                        </TouchableOpacity>

                        {/* Quantity */}
                        <View style={styles.qty}>
                            <Text style={{ ...FONTS.h4 }}>{item.qty}</Text>
                        </View>

                        {/* increase qty */}
                        <TouchableOpacity style={styles.increase_qty}
                            onPress={() => { changeQty(item, '+') }}>
                            <Text style={styles.change_qty_text}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    return (

        <View style={{ flex: 1 }}>

            <FlatList
                data={cartItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{
                    padding: 16,
                }} />

            {(getTotal() != 0) ?

                <View style={styles.bottom_container}>
                    {/* Total */}
                    <View style={styles.total}>
                        <Text style={styles.total_text}>Total:</Text>
                        <Text style={styles.total_text}>Rs. {getTotal()}</Text>
                    </View>
                    {/* Order Button */}
                    <View style={{ margin: SIZES.padding * 2, marginTop: 0 }}>
                        <CustomButton text='Confirm Order'
                            onPressButton={() => handlePayment()} />


                    </View>
                </View>
                :
                <View style={styles.empty_text}>
                    <Text style={{ ...FONTS.h4 }}>Your Cart is empty!</Text>
                </View>
            }

        </View>
    )
}

export default CartItems;

const styles = StyleSheet.create({
    container: {
        margin: 8,
        elevation: 3,
        width: SIZES.width - 45,
        height: 100,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.white
    },

    image: {
        position: 'absolute',
        marginLeft: 8,
        width: '30%',
        height: '100%',
        borderRadius: SIZES.radius,
    },

    name_price_container: {
        padding: SIZES.padding,
        position: 'absolute',
        right: 0,
        height: '100%',
        width: '65%',
    },

    name: {
        ...FONTS.body4,
        color: COLORS.black,
        width: (SIZES.width - (SIZES.padding * 20))
    },

    price: {
        ...FONTS.body4,
        color: COLORS.primary
    },

    delete: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: SIZES.padding,
        right: SIZES.padding,
        justifyContent: 'center',
        alignItems: 'center',
    },

    qty_container: {
        position: 'absolute',
        bottom: 6,
        left: 80,
        height: 40,
        justifyContent: 'center',
        flexDirection: 'row'
    },

    qty: {
        width: 30,
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center'
    },

    decrease_qty: {
        width: 30,
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20
    },

    increase_qty: {
        width: 30,
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },

    change_qty_text: {
        ...FONTS.body2,
        color: COLORS.black
    },

    bottom_container: {
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 5,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    total: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SIZES.padding * 2,
        marginHorizontal: SIZES.padding * 3,
        borderBottomColor: COLORS.lightGray,
        borderBottomWidth: 2
    },

    total_text: {
        marginLeft: SIZES.padding,
        ...FONTS.h3,
        color: COLORS.black
    },

    empty_text: {
        flex: 1,
        justifyContent: 'space-between',
        alignSelf: 'center'
    }


})