import React, { Component } from 'react'
import {storeProducts, detailProduct} from './data'

const ProductContext = React.createContext();
// Provider
// Consumer

class ProductProvider extends Component {
        state = {
            products:[],
            cart: [],
            detailProduct:detailProduct,
            modalOpen: false,
            modalProduct:detailProduct,
            cartSubTotal:0,
            cartTax:0,
            cartTotal:0,
        }
        componentDidMount () {
            this.setProducts();
        }
        
        setProducts = () => {
            let tmpProducts = []
            storeProducts.forEach(item => {
                const singleItem = {...item};
                tmpProducts = [...tmpProducts, singleItem];
            })
            this.setState(() => {
                return {products: tmpProducts}
            });
        };

    getItem = (id) => {
        return this.state.products.find(item => item.id === id)
    }

    handleDetail = (id) => {
        const product = this.getItem(id)
        this.setState(() => {
            return {
                detailProduct:product
            }
        })
    }

    addToCart = (id) => {
        let tempProducts = [...this.state.products]
        const index = tempProducts.indexOf(this.getItem(id))
        const product = tempProducts[index]
        product.inCart = true;
        product.count = 1
        
        const price = product.price 
        product.total = price * product.count
        
        this.setState(() => {
            return {
                products: tempProducts,
                cart: [...this.state.cart, product],
                modalOpen: true
            }
        }, () => { this.addTotals();})
    };

    openModal = (id) => {
        //console.log('model open')
        const product = this.getItem(id)
        this.setState(() => {
            return {
                modalProduct: product,
                modelOpen: true
            }
        })
    }

    closeModal = () => {
        this.setState(() => {
            return {
                modalOpen: false
            }
        })
    }

    increment = (id) => {
        let tempCart = [...this.state.cart]
        const selectedProduct = tempCart.find(item => item.id === id)
        if(selectedProduct) {
            selectedProduct.count++;
            selectedProduct.total = selectedProduct.price * selectedProduct.count;

            this.setState(() => {
                return {
                    cart: [...tempCart]
                }
            }, () => {
                this.addTotals()
            })
        }
    };

    decrement = (id) => {
        let tempCart = [...this.state.cart]
        const selectedProduct = tempCart.find(item => item.id === id)
        if(selectedProduct) {
            selectedProduct.count--;

            if(selectedProduct.count <= 0){
                this.removeItem(id)
            }
            else {
                selectedProduct.total = selectedProduct.price * selectedProduct.count;

                this.setState(() => {
                    return {
                        cart: [...tempCart]
                    }
                }, () => {
                    this.addTotals()
                })
            }
        }
    };

    removeItem = (id) => {
        let tempProducts = [...this.state.products]
        let tempCart = [...this.state.cart]

        tempCart = tempCart.filter(item => item.id !== id)
        
        const index = tempProducts.indexOf(this.getItem(id))
        let removedProduct = tempProducts[index]
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;

        this.setState(() => {
            return {
                cart: [...tempCart],
                product: [...tempProducts],
            }
        }, () => {
            this.addTotals()
        })
    }

    clearCart = () => {
        this.setState(() => {
            return {
                cart: []
            }
        }, () => {
            this.setProducts();
            this.addTotals();
        })
    }

    addTotals = () => {
        let subTotal = 0;
        this.state.cart.map(item => {
            subTotal += item.total
        })

        const tempTax = subTotal * 0.18
        const tax = parseFloat(tempTax.toFixed(2))
        const total = subTotal + tax
        this.setState(() => {
            return {
                cartSubTotal: subTotal.toFixed(2),
                cartTax: tax,
                cartTotal: total.toFixed(2)
            }
        })
    }

  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail:this.handleDetail,
        addToCart:this.addToCart,
        openModal: this.openModal,
        closeModal: this.closeModal,
        increment: this.increment,
        decrement: this.decrement,
        removeItem: this.removeItem,
        clearCart: this.clearCart,
      }}>
        {this.props.children }
      </ProductContext.Provider>
    )
  }
}

const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer};