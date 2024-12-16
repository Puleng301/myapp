import React, { useState, useEffect } from 'react';
import './ProductManagement.css'
import useAxiosIntercepters from '../hooks/useAxiosIntercepters';
import useAuth from '../hooks/use-auth';
import useFetchData from '../hooks/useFetchData';

const ProductManagement = ({ onProductAdded, products }) => {
    const [productName, setProductName] = useState('');
    const [loading, setLoading] = useState(false);
    const {user} = useAuth()
    const {data} = useFetchData('/products/'+user.userId,[user])
    const transactions = useFetchData('/transactions/'+user.userId,[user])
    const axios = useAxiosIntercepters()
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableProducts, setAvailableProducts] = useState(products);
    const [filteredProducts, setFilteredProducts] = useState(products);
    //const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        setAvailableProducts(data);
        setFilteredProducts(data);
    }, [products]);

    useEffect(() => {
        
        const updatedFilteredProducts = availableProducts?.filter(product => product?.quantity > 0);
        setFilteredProducts(updatedFilteredProducts);
    }, [availableProducts]);
    
    const handleSearch = () => {
        const results = availableProducts?.filter(product =>
            product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    };
    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();

        const pricePerItem = parseFloat(productPrice) / parseInt(productQuantity);
         alert(`Price per item is: M${pricePerItem.toFixed(2)}. Total items added: ${productQuantity}`);

         let updatedProducts;

        if (editMode && currentProductId) {
            try {
                setLoading(true)
                const data = {productName,productDescription,productPrice,productQuantity,productCategory,userId:user.userId,productId:currentProductId} 
                const res = await axios.put('/product/edit',data,{
                    withCredentials:true
                })
                setLoading(false)
                alert(res.data)
                console.log(res.data)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
            alert(`Product "${productName}" successfully updated!`);
            
           // const updateTransaction = {
            // productName: productName,
              // quantityAdded: parseInt(productQuantity),
              // quantitySubtracted: 0,
             // quantitySold: 0,
          // date: new Date().toLocaleString(),
           //  };
            // setTransactions((prevTransactions) => [...prevTransactions, updateTransaction]);

        } else {
        try {
            setLoading(true)
            const data = {productName,productDescription,productPrice,productQuantity,productCategory,userId:user.userId} 
            const res = await axios.post('/product/new',data,{
                withCredentials:true
            })
            setLoading(false)
            alert(res.data)
            console.log(res.data)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
        };
    }
    const handleEditProduct = (product) => {
        setProductName(product?.productName);
        setProductDescription(product?.productDescription);
        setProductCategory(product.productCategory);
        setProductPrice(product?.productPrice); 
        setProductQuantity(product?.productQuantity);
        setCurrentProductId(product?.productId); 
        setEditMode(true);
    };

    const handleSellProduct = async (productId) => {
        const quantityToSell = prompt("Enter quantity to sell:");
        const quantityNumber = parseInt(quantityToSell);

        if (quantityToSell && !isNaN(quantityNumber)) {
            try {
                const res = await axios.put('/selling',{quantityNumber,productId,userId:user?.userId})
                alert(res?.data)
            } catch (error) {
                alert(error?.data)
                console.log(error)
            }
        } else {
            alert("Please enter a valid quantity.");
        }
    };

    const resetForm = () => {
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setProductQuantity('');
        setProductCategory('');
        setEditMode(false);
        setCurrentProductId(null); 
    };

    return (
        <div style={!addMode ? {backgroundColor:'#eee'}:{}} className='product-management-container'>
            <h2>Product Management</h2>
            <div className='search-wrapper'>
                
            
            <button className='search-button' onClick={()=>setAddMode(!addMode)}>{addMode?'Show List':'Add Product'}</button>
            </div>

            
            {
                addMode 
                ?

            
            <div className='wrapper'>
                <h2>{editMode?'Update Product':'Add Product'}</h2>
                <form className='product-form' onSubmit={handleAddOrUpdateProduct}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={productQuantity}
                        onChange={(e) => setProductQuantity(e.target.value)}
                        required
                    />
                    <button disabled={loading} type="submit">{editMode ? 'Update Product' :!loading? 'Add Product':'Adding...'}</button>
                </form>
            </div>
            :<>
            <h3>Available Products</h3>
            <table style={{color:'gray'}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!data || data?.length > 0 ? (
                        data?.map((product) => (
                            <tr key={product.productId}>
                                <td>{product.productName}</td>
                                <td>{product.productDescription}</td>
                                <td>{product.productCategory}</td>
                                <td>M{Number(product.productPrice).toFixed(2)}</td> {/* Display price in M */}
                                <td>{product.productQuantity}</td>
                                <td>M{(Number(product.productPrice) * Number(product.productQuantity)).toFixed(2)}</td> {/* Total price in M */}
                                <td>
                                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                                    <button onClick={() => handleSellProduct(product.productId)}>Sell</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No products found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3>Transaction History</h3>
            <table style={{color:'gray'}}>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity Added</th>
                        <th>Quantity Subtracted</th>
                        <th>Quantity Sold</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions?.data?.length > 0 ? (
                        transactions?.data?.map((transaction, index) => (
                            <tr key={transaction.transactionsId}>
                                <td>{transaction.productName}</td>
                                <td>{transaction.quantityAdded}</td>
                                <td>{transaction.quantitySubtracted}</td>
                                <td>{transaction.quantitySold}</td>
                                <td>{transaction.date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No transactions recorded.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </>
            }
        </div>
    );
};

export default ProductManagement;
