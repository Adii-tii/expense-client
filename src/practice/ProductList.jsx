const ProductList = ({Product}) => {
    const listOfProducts = Product.map(product => <li>{product.name}</li>);

    return(
        <>
            <ul>{listOfProducts}</ul>
        </>
    )
}

export default ProductList;