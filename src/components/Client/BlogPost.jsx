import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../../styles/Blog.css';

function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const blogRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(blogRef);
      if (docSnap.exists()) {
        setBlog({ id: docSnap.id, ...docSnap.data() });
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="blog-post container">
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
    </div>
  );
}

export default BlogPost;