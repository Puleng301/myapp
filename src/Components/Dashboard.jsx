import './Dashboard.css'
import useFetchData from '../hooks/useFetchData';
import useAuth from '../hooks/use-auth';

const Dashboard = () => {
    const {user} = useAuth()
    const products = useFetchData('/products/'+user.userId)
    const totalValue = products?.data?.reduce((sum, product) => sum + (product.productPrice * product.productQuantity), 0).toFixed(2);
    const totalProducts = products?.data?.reduce((sum, product) => sum + product.productQuantity, 0);


    
    const formatCurrency = (amount) => `M${parseFloat(amount).toFixed(2)}`;

    return (
        <div>
            <h2>Inventory Dashboard</h2>
            <h3>Total Products: {totalProducts}</h3>
            <h3>Total Value: {formatCurrency(totalValue)}</h3>
            <table style={{color:'grey'}}>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th> {}
                    </tr>
                </thead>
                <tbody>
                    {products?.data?.length > 0 ? (
                        products?.data?.map((item) => {
                            const itemTotalPrice = (item.productPrice * item.productQuantity).toFixed(2);
                            return (
                                <tr key={item.productId}>
                                    <td>{item.productName}</td>
                                    <td>{item.productDescription}</td>
                                    <td>{formatCurrency(item.productPrice)}</td> {}
                                    <td>{item.productQuantity}</td>
                                    <td>{formatCurrency(itemTotalPrice)}</td> {}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5">No inventory items available.</td> {}
               </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
