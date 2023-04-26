import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import "./Inventory.scss"
import { AuthContext } from '../context/authContext.js';
import cart from '../images/cart.png'
import { useDispatch } from 'react-redux';
import { addInCart } from '../redux/cartReducer';

var filteroption = "all";
var sortoption = "default";

const Inventory = () => {
    const { currentUser } = useContext(AuthContext);
    const [inventory, setInventory] = useState([]);
    const dispatch = useDispatch();



    const fetchAllGames = async () => {
        try {
            const res = await axios.get(`/inventory/?filter=${filteroption}&sort=${sortoption}`)
            setInventory(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSortChange = (event) => {
        sortoption = event.target.value;
        fetchAllGames();
    }

    const handleFilterChange = (event) => {
        filteroption = event.target.value;
        fetchAllGames();
    }


    useEffect(() => {
        fetchAllGames();
    }, []);

    const handleSubmit = async (gameandCust) => {
        try {
            dispatch(addInCart({
                sku: gameandCust.video_game.sku,
                cover: gameandCust.video_game.cover,
                title: gameandCust.video_game.title,
                genre1: gameandCust.video_game.genre1,
                genre2: gameandCust.video_game.genre2,
                price: gameandCust.video_game.price,
                custID: currentUser.username,
                qty: 1,
            }))
            await axios.post("/cart/addToCart", gameandCust);
        } catch (err) {
        }
    };

    //console.log(msg);

    return (
        <div>
            <nav className="product-filter">

                <h1>Games</h1>

                <div className="sort">

                    <div className="collection-sort">
                        <label>Filter by:</label>
                        <select onChange={handleFilterChange}>
                            <option value="all">All Consoles</option>
                            <option value="nintendo">Nintendo</option>
                            <option value="sony">Sony</option>
                            <option value="microsoft">Microsoft</option>
                        </select>
                    </div>

                    <div className="collection-sort">
                        <label>Sort by:</label>
                        <select onChange={handleSortChange}>
                            <option value="default">Featured</option>
                            <option value="lowhigh">By Price: Low to High</option>
                            <option value="highlow">By Price: High to Low</option>
                        </select>
                    </div>

                </div>

            </nav>
            <div className='buttonWrapper'>
                {(currentUser !== null && (currentUser.type === "emp" || currentUser.type === "own")) && <Link to="/add"><button className='Button'>Add new game</button></Link>}
                {(currentUser !== null && (currentUser.type === "own")) && <Link to="/employees"><button className='Button'>Manage Employees</button></Link>}
            </div>
            <div className="Inventory">
                {inventory.map(video_game => (
                    <div className='video_game' key={video_game.sku}>
                        <div className="card">
                            <div className='titleYear'>
                                <div className="image">
                                    {video_game.cover && <img src={video_game.cover} alt='' />}
                                    <div className="info">
                                        <h2>{video_game.title} - {video_game.systemName}</h2>
                                        <p>{video_game.year_of_release}</p>
                                    </div>
                                    <div className='priceCart'>
                                        <h3>${video_game.price}</h3>
                                        <button className='cart' onClick={() => handleSubmit({ video_game, 'custID': currentUser.username })}>
                                            <img src={cart} alt="" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
};

export default Inventory;