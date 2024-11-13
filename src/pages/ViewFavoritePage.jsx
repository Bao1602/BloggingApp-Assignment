import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig';
import { Button, Box, Divider, Typography } from '@mui/material';
import BlogCard from '../components/BlogCard';
import Alert from '../components/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const ViewFavoritePage = () => {

    const favoriteBlogCollectionReference = collection(db, "favorite");
    const [currentUser, setCurrentUser] = useLocalStorage('current_user', null);

    const [blogsList, setBlogsList] = useState([]);
    const [favoritesList, setFavoritesList] = useState([]);
    const [alertConfig, setAlertConfig] = useState({});
    const navigate = useNavigate();

    //GETTING favorites List this is use for favorite page
    const getFavoritesList = async () => {
        const favorites = await getDocs(favoriteBlogCollectionReference);
        const extractedFavorites = favorites.docs.filter(doc => doc.data().userId !== currentUser.uid).map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setFavoritesList(extractedFavorites);
        console.log(extractedFavorites, 'fvr blog');
    };

    const deleteBlog = async (id) => {
        const blogDoc = doc(db, "blogs", id);
        try {
            await deleteDoc(blogDoc);
            setAlertConfig({ message: 'Successfully deleted the blog', color: 'success', isOpen: true });
            setBlogsList(prev => prev.filter(blog => blog.id !== id));
        } catch (error) {
            setAlertConfig({ message: 'Error deleting the blog', color: 'error', isOpen: true });
        }
    };

    //Favorite Features
    const addFavorite = async (blog) => {
        const favoriteDoc = doc(favoriteBlogCollectionReference, `${currentUser.uid}_${blog.id}`);
        try {
            await setDoc(favoriteDoc, { 
                userId: currentUser.uid,//getting current user id 
                ...blog//adding everything from the blog for later to fetch in view favorite
            });
            console.log(blog.id, "this is coming from add favorite");

            setFavoritesList(prev => [...prev, blog.id]);
            setAlertConfig({ message: 'Added to favorites', color: 'success', isOpen: true });
        } catch (error) {
            setAlertConfig({ message: 'Error adding to favorites', color: 'error', isOpen: true });
        }
    };

    const removeFavorite = async (blog) => {
        const favoriteDoc = doc(favoriteBlogCollectionReference, `${currentUser.uid}_${blog.id}`);
        try {
            await deleteDoc(favoriteDoc);
            setFavoritesList(prev => prev.filter(id => id !== blog.id));
            setAlertConfig({ message: 'Removed from favorites', color: 'success', isOpen: true });
        } catch (error) {
            setAlertConfig({ message: 'Error removing from favorites', color: 'error', isOpen: true });
        }
    };

    const isFavorite = (blog) => favoritesList.includes(blog.id);

    useEffect(() => {
        getFavoritesList();
    }, [alertConfig]);

    return (
        <Box display="flex" flexDirection="column" gap="20px">
            <Button onClick={() => navigate('/home')}>
                <ArrowBackIcon /> BACK
            </Button>
            <Typography variant="h3">View Your Favorite Blog</Typography>
            <Divider />
            <Box display="grid" gridTemplateColumns="33% 33% 33%" gap="12px">
                {favoritesList.map((blog, index) => (
                    <BlogCard
                        key={index}
                        blog={blog}
                        deleteBlog={deleteBlog}
                        isFavoriteblg={isFavorite(blog)}
                        addFavoriteblg={() => addFavorite(blog)}
                        removeFavoriteblg={() => removeFavorite(blog)}
                    />
                ))}
            </Box>
            <Alert alertConfig={alertConfig} />
        </Box>
    );
}

export default ViewFavoritePage