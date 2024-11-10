/* eslint-disable react/prop-types */
import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const BlogCard = (props) => {
    const { blog, deleteBlog = () => {}, showDeleteIcon = true } = props;
    const [ isFavorite, setIsFavorite]= useState(false);
    // Favorites Table as well in the database

    const navigate = useNavigate();

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite); // Toggle favorite state
        console.log("coming from favorite click")
    };

    return (
        <Card style={{ position: 'relative' }}>
            <CardMedia
                sx={{ height: 140 }}
                image={blog.image}
                title="green iguana"
            />
            {
                showDeleteIcon && <IconButton style={{ position: 'absolute', right: '10px', top: '5px' }} aria-label="delete" size="small" onClick={() => deleteBlog(blog.id)}>
                <DeleteIcon fontSize="inherit" />
            </IconButton>
            }
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {blog.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {blog.description}
                </Typography>
                <Chip label={blog.category} variant="outlined" />

            </CardContent>
            <CardActions>
                <IconButton color="error" onClick={handleFavoriteClick}> {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />} </IconButton>
                <Button color='secondary' variant='contained' onClick={() => navigate(`/viewblogs/${blog.id}`)}>Learn More</Button>
            </CardActions>
        </Card>
    )
}

export default BlogCard