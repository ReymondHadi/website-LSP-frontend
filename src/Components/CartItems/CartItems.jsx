import React, { useContext, useState } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'

const CartItems = () => {
    const {getTotalCartAmount, all_product, cartItems, removeFromCart, clearCart} = useContext(ShopContext);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [customerAddress, setCustomerAddress] = useState({
        street: '',
        city: '',
        province: '',
        postalCode: '',
        notes: ''
    });
    
    // Payment methods details
    const paymentMethods = {
        BCA: {
            type: 'bank',
            accountNumber: '1660339678',
            accountName: 'Dapur Bunda Bahagia'
        },
        BRI: {
            type: 'bank',
            accountNumber: '0987654321',
            accountName: 'Dapur Bunda Bahagia'
        },
        Mandiri: {
            type: 'bank',
            accountNumber: '5647382910',
            accountName: 'Dapur Bunda Bahagia'
        },
        COD: {
            type: 'cod',
            name: 'Cash on Delivery'
        }
    };

    const handleProceedToCheckout = () => {
        setShowPayment(true);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setCustomerAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaymentConfirmation = async () => {
        try {
            if (!selectedPaymentMethod) {
                alert('Silakan pilih metode pembayaran terlebih dahulu');
                return;
            }

            // Validasi alamat
            if (!customerAddress.street || !customerAddress.city || !customerAddress.province || !customerAddress.postalCode) {
                alert('Silakan lengkapi alamat pengiriman terlebih dahulu');
                return;
            }

            // Simpan transaksi ke backend
            const items = all_product
                .filter(e => cartItems[e.id] > 0)
                .map(e => ({
                    productId: e.id,
                    name: e.name,
                    quantity: cartItems[e.id],
                    price: e.new_price
                }));
            
            const transactionData = {
                items,
                totalAmount: getTotalCartAmount(),
                paymentMethod: selectedPaymentMethod,
                bank: selectedPaymentMethod === 'COD' ? 'COD' : selectedPaymentMethod,
                address: customerAddress // Kirim data alamat
            };
            
            // Kirim data transaksi ke backend
            const response = await fetch('http://localhost:4000/create-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify(transactionData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Clear cart and show success message
                clearCart();
                setPaymentConfirmed(true);
                
                // Reset after 5 seconds
                setTimeout(() => {
                    setShowPayment(false);
                    setPaymentConfirmed(false);
                    setSelectedPaymentMethod('');
                    setCustomerAddress({
                        street: '',
                        city: '',
                        province: '',
                        postalCode: '',
                        notes: ''
                    });
                }, 5000);
            } else {
                alert('Gagal menyimpan transaksi');
            }
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert('Terjadi kesalahan saat mengkonfirmasi pembayaran');
        }
    };

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e)=>{
                if(cartItems[e.id]>0)
                {
                    return <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt="" className='carticon-product-icon' />
                                <p>{e.name}</p>
                                <p>Rp {e.new_price.toLocaleString('id-ID')}</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>Rp {(e.new_price*cartItems[e.id]).toLocaleString('id-ID')}</p>
                                <img className='cartitems-remove-icon' src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt="" />
                            </div>
                            <hr />
                        </div>
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>Rp {getTotalCartAmount().toLocaleString('id-ID')}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>Rp {getTotalCartAmount().toLocaleString('id-ID')}</h3>
                        </div>
                    </div>
                    <div className="cartitems-buttons">
                        {!showPayment ? (
                            <>
                                <button onClick={handleProceedToCheckout}>
                                    PROCEED TO CHECKOUT
                                </button>
                            </>
                        ) : null}
                    </div>
                    
                    {/* Payment Gateway Section */}
                    {showPayment && (
                        <div className="payment-gateway">
                            {paymentConfirmed ? (
                                <div className="payment-success">
                                    <h3>Pesanan Berhasil!</h3>
                                    <p>
                                        {selectedPaymentMethod === 'COD' 
                                            ? 'Pesanan COD Anda telah diterima. Kami akan menghubungi Anda untuk proses pengiriman.'
                                            : 'Terima kasih telah berbelanja. Pesanan Anda sedang diproses.'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h3>Pilih Metode Pembayaran</h3>
                                    <div className="payment-options">
                                        {/* Bank Transfer Options */}
                                        <div className="payment-category">
                                            <h4>Transfer Bank</h4>
                                            <div className="bank-options">
                                                <div 
                                                    className={`payment-option ${selectedPaymentMethod === 'BCA' ? 'selected' : ''}`}
                                                    onClick={() => setSelectedPaymentMethod('BCA')}>
                                                    <div className="bank-logo bca"></div>
                                                    <span>BCA</span>
                                                </div>
                                                <div 
                                                    className={`payment-option ${selectedPaymentMethod === 'BRI' ? 'selected' : ''}`}
                                                    onClick={() => setSelectedPaymentMethod('BRI')}>
                                                    <div className="bank-logo bri"></div>
                                                    <span>BRI</span>
                                                </div>
                                                <div 
                                                    className={`payment-option ${selectedPaymentMethod === 'Mandiri' ? 'selected' : ''}`}
                                                    onClick={() => setSelectedPaymentMethod('Mandiri')}>
                                                    <div className="bank-logo mandiri"></div>
                                                    <span>Mandiri</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* COD Option */}
                                        <div className="payment-category">
                                            <h4>Pembayaran di Tempat</h4>
                                            <div 
                                                className={`payment-option cod-option ${selectedPaymentMethod === 'COD' ? 'selected' : ''}`}
                                                onClick={() => setSelectedPaymentMethod('COD')}>
                                                <div className="cod-icon">💰</div>
                                                <div className="payment-info">
                                                    <span>Cash on Delivery (COD)</span>
                                                    <small>Bayar ketika barang sampai</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {selectedPaymentMethod && (
                                        <div className="payment-details">
                                            {/* Address Form */}
                                            <div className="address-section">
                                                <h4>Alamat Pengiriman</h4>
                                                <div className="address-form">
                                                    <div className="form-group">
                                                        <label>Jalan dan Nomor Rumah *</label>
                                                        <input
                                                            type="text"
                                                            name="street"
                                                            value={customerAddress.street}
                                                            onChange={handleAddressChange}
                                                            placeholder="Contoh: Jl. Merdeka No. 123"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group">
                                                            <label>Kota *</label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={customerAddress.city}
                                                                onChange={handleAddressChange}
                                                                placeholder="Contoh: Bandung"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Provinsi *</label>
                                                            <input
                                                                type="text"
                                                                name="province"
                                                                value={customerAddress.province}
                                                                onChange={handleAddressChange}
                                                                placeholder="Contoh: Jawa Barat"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Kode Pos *</label>
                                                            <input
                                                                type="text"
                                                                name="postalCode"
                                                                value={customerAddress.postalCode}
                                                                onChange={handleAddressChange}
                                                                placeholder="Contoh: 40115"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Catatan untuk Kurir (Opsional)</label>
                                                        <textarea
                                                            name="notes"
                                                            value={customerAddress.notes}
                                                            onChange={handleAddressChange}
                                                            placeholder="Contoh: Rumah warna biru, dekat sekolah"
                                                            rows="3"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedPaymentMethod === 'COD' ? (
                                                <div className="cod-details">
                                                    <h4>Cash on Delivery</h4>
                                                    <p>Pilih metode ini untuk pembayaran tunai ketika barang sudah sampai di tempat Anda.</p>
                                                    
                                                    <div className="cod-instructions">
                                                        <h5>Proses COD:</h5>
                                                        <ol>
                                                            <li>Pesanan Anda akan diproses setelah konfirmasi</li>
                                                            <li>Kurir akan mengantarkan pesanan ke alamat Anda</li>
                                                            <li>Bayar tunai sejumlah total pesanan kepada kurir</li>
                                                            <li>Barang akan diserahkan setelah pembayaran</li>
                                                        </ol>
                                                    </div>
                                                    
                                                    <div className="cod-note">
                                                        <strong>Catatan:</strong> Pastikan Anda berada di alamat pengiriman saat kurir datang.
                                                    </div>
                                                    
                                                    <p className="total-amount-cod">
                                                        Total yang harus dibayar: <strong>Rp {getTotalCartAmount().toLocaleString('id-ID')}</strong>
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="bank-details">
                                                    <h4>Rekening {selectedPaymentMethod}</h4>
                                                    <p>Nomor Rekening: <strong>{paymentMethods[selectedPaymentMethod].accountNumber}</strong></p>
                                                    <p>Atas Nama: <strong>{paymentMethods[selectedPaymentMethod].accountName}</strong></p>
                                                    <p>Total Pembayaran: <strong>Rp {getTotalCartAmount().toLocaleString('id-ID')}</strong></p>
                                                    
                                                    <div className="payment-instructions">
                                                        <h5>Instruksi Pembayaran:</h5>
                                                        <ol>
                                                            <li>Transfer tepat sejumlah total pembayaran ke rekening di atas</li>
                                                            <li>Simpan bukti transfer</li>
                                                            <li>Klik tombol konfirmasi di bawah setelah transfer</li>
                                                        </ol>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="payment-action-buttons">
                                                <button 
                                                    onClick={handlePaymentConfirmation}
                                                    className="confirm-payment-button"
                                                >
                                                    {selectedPaymentMethod === 'COD' ? 'Konfirmasi Pesanan COD' : 'Saya Sudah Transfer'}
                                                </button>
                                                
                                                <button 
                                                    onClick={() => {
                                                        setShowPayment(false);
                                                        setSelectedPaymentMethod('');
                                                        setCustomerAddress({
                                                            street: '',
                                                            city: '',
                                                            province: '',
                                                            postalCode: '',
                                                            notes: ''
                                                        });
                                                    }}
                                                    className="cancel-payment-button"
                                                >
                                                    Batalkan Pembayaran
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promocode, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder='Promo Code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItems