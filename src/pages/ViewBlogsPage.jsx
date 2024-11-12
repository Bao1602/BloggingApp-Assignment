import { collection, deleteDoc, doc, getDocs, addDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { Button, Box, Divider, Typography } from '@mui/material';
import BlogCard from '../components/BlogCard';
import Alert from '../components/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const ViewBlogsPage = () => {
    const blogCollectionReference = collection(db, "blogs");
    const favoriteBlogCollectionReference = collection(db, "favorite");
    const [currentUser, setCurrentUser] = useLocalStorage('current_user', null);

    const [blogsList, setBlogsList] = useState([]);
    const [favoritesList, setFavoritesList] = useState([]);
    const [alertConfig, setAlertConfig] = useState({});
    const navigate = useNavigate();

    const getBlogsList = async () => {
        const blogs = await getDocs(blogCollectionReference);
        const extractedBlogs = blogs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setBlogsList(extractedBlogs);
        console.log(extractedBlogs, 'blogs');
    };

    const getFavoritesList = async () => {
        const favorites = await getDocs(favoriteBlogCollectionReference);
        const extractedFavorites = favorites.docs
            .filter(doc => doc.data().userId === currentUser.uid)
            .map(doc => doc.data().blogId);

        setFavoritesList(extractedFavorites);
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

    const addFavorite = async (blogId) => {
        const favoriteDoc = doc(favoriteBlogCollectionReference, `${currentUser.uid}_${blogId}`);
        try {
            await setDoc(favoriteDoc, { userId: currentUser.uid, blogId });
            setFavoritesList(prev => [...prev, blogId]);
            setAlertConfig({ message: 'Added to favorites', color: 'success', isOpen: true });
        } catch (error) {
            setAlertConfig({ message: 'Error adding to favorites', color: 'error', isOpen: true });
        }
    };

    const removeFavorite = async (blogId) => {
        const favoriteDoc = doc(favoriteBlogCollectionReference, `${currentUser.uid}_${blogId}`);
        try {
            await deleteDoc(favoriteDoc);
            setFavoritesList(prev => prev.filter(id => id !== blogId));
            setAlertConfig({ message: 'Removed from favorites', color: 'success', isOpen: true });
        } catch (error) {
            setAlertConfig({ message: 'Error removing from favorites', color: 'error', isOpen: true });
        }
    };

    const isFavorite = (blogId) => favoritesList.includes(blogId);

    useEffect(() => {
        getBlogsList();
        getFavoritesList();
    }, [alertConfig]);

    return (
        <Box display="flex" flexDirection="column" gap="20px">
            <Button onClick={() => navigate('/home')}>
                <ArrowBackIcon /> BACK
            </Button>
            <Typography variant="h3">View Blogs</Typography>
            <Divider />
            <Box display="grid" gridTemplateColumns="33% 33% 33%" gap="12px">
                {blogsList.map((blog, index) => (
                    <BlogCard
                        key={index}
                        blog={blog}
                        deleteBlog={deleteBlog}
                        isFavoriteblg={isFavorite(blog.id)}
                        addFavoriteblg={() => addFavorite(blog.id)}
                        removeFavoriteblg={() => removeFavorite(blog.id)}
                    />
                ))}
            </Box>
            <Alert alertConfig={alertConfig} />
        </Box>
    );
};

export default ViewBlogsPage;
