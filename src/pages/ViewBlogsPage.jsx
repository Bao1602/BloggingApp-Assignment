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
    const [currentUser, setCurrentUser] = useLocalStorage('current_user', null);

    const blogCollectionReference = collection(db, "blogs");
    const favoriteBlogCollectionReference = collection(db, "favorite");

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
        //checking if current user like the post that they created
        if(currentUser.uid === blog.userId){
            setAlertConfig({ message: 'You cannot Favorite Your own Post (━┳━｡ Д ｡━┳━)', color: 'error', isOpen: true });
            return;
        }

        const favoriteDoc = doc(favoriteBlogCollectionReference, `${currentUser.uid}_${blog.id}`);
        try {
            await setDoc(favoriteDoc, { 
                userId: currentUser.uid,//getting current user id 
                ...blog//adding everything from the blog for later to fetch in view favorite
            });
            console.log(blog.id, "this is coming from add favorite ٩꒰ʘʚʘ๑꒱۶");

            setFavoritesList(prev => [...prev, blog.id]);
            setAlertConfig({ message: 'Added to favorites (o・┏ω┓・o)', color: 'success', isOpen: true });
        } catch (error) {
            setAlertConfig({ message: 'Error adding to favorites', color: 'error', isOpen: true });
        }
    };

    const removeFavorite = async (blog) => {    
        //make unique id
        const favoriteDoc = doc(favoriteBlogCollectionReference, `${currentUser.uid}_${blog.id}` );
        try {
            await deleteDoc(favoriteDoc);
            setFavoritesList(prev => prev.filter(id => id !== blog.id));
            setAlertConfig({ message: 'Removed from favorites (๏ᆺ๏υ)', color: 'success', isOpen: true });
        } catch (error) {
            setAlertConfig({ message: 'Error removing from favorites (━┳━｡ Д ｡━┳━)', color: 'error', isOpen: true });
        }
    };

    const isFavorite = (blog) => favoritesList.includes(blog.id);

    useEffect(() => {
        getBlogsList();
    }, [alertConfig]);

    return (
        <Box display="flex" flexDirection="column" gap="20px">
            <Button onClick={() => navigate('/home')}>
                <ArrowBackIcon /> BACK
            </Button>
            <Typography variant="h3">View Blogs `(,,◕　⋏　◕,,)`</Typography>
            <Divider />
            <Box display="grid" gridTemplateColumns="33% 33% 33%" gap="12px">
                {blogsList.map((blog, index) => (
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
};

export default ViewBlogsPage;
