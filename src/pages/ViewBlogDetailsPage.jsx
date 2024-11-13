import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import BlogCard from "../components/BlogCard";
import { Typography, Button, Box , IconButton} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import Alert from '../components/Alert';

const ViewBlogDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({});
  const [favoritesList, setFavoritesList] = useState([]); // Store favorites
  const [alertConfig, setAlertConfig] = useState({});
  const [currentUser, setCurrentUser] = useLocalStorage("current_user", null);

  const getBlogData = async () => {
    const snap = await getDoc(doc(db, "blogs", id));
    if (snap.exists()) {
      setBlogData(snap.data());
    }
  };

  const addFavorite = async (blog) => {
    if (currentUser.uid === blog.userId) {
      setAlertConfig({
        message: "You cannot Favorite Your own Post (━┳━｡ Д ｡━┳━)",
        color: "error",
        isOpen: true,
      });
      return;
    }
    const favoriteDoc = doc(
      favoriteBlogCollectionReference,
      `${currentUser.uid}_${blog.id}`
    );
    try {
      await setDoc(favoriteDoc, {
        userId: currentUser.uid, //getting current user id
        ...blog, //adding everything from the blog for later to fetch in view favorite
      });
      console.log(blog.id, "this is coming from add favorite ٩꒰ʘʚʘ๑꒱۶");

      setFavoritesList((prev) => [...prev, blog.id]);
      setAlertConfig({
        message: "Added to favorites (o・┏ω┓・o)",
        color: "success",
        isOpen: true,
      });
    } catch (error) {
      setAlertConfig({
        message: "Error adding to favorites",
        color: "error",
        isOpen: true,
      });
    }
  };

  const removeFavorite = async (blog) => {
    const favoriteDoc = doc(favoriteBlogCollectionReference, `${currentUser.uid}_${blog.id}`);
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
    getBlogData();
  }, [id]);

  return (
    <Box>
      <Button onClick={() => navigate('/home')}>
        <ArrowBackIcon /> BACK
      </Button>
      <BlogCard blog={blogData} showDeleteIcon={false} />

      <IconButton
        onClick={() => isFavorite(blogData) ? removeFavorite(blogData) : addFavorite(blogData)}
        color={isFavorite(blogData) ? "error" : "default"} // Filled if favorite
      >
      </IconButton>

      <Alert alertConfig={alertConfig} />
    </Box>
  );
};

export default ViewBlogDetailsPage;
