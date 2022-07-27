import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Spinner } from '../../components/Spinner';

import { PostExcerpt } from './PostExcerpt';

import { fetchPosts, selectAllPosts, selectPostsError, selectPostsStatus } from './postsSlice';

import { REQUEST_STATUS } from '../../shared/constants';

export const PostsList = () => {
  const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);

  useEffect(() => {
    if(postStatus === REQUEST_STATUS.IDLE) {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  // Sort posts in reverse chronological order by date time string
  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

  const renderPosts = () => {
    if(postStatus === REQUEST_STATUS.LOADING) {
      return <Spinner text="Loading..." />;
    }

    if(postStatus === REQUEST_STATUS.FAILED) {
      return <div>{error}</div>;
    }

    return orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} />
    ));
  };

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderPosts()}
    </section>
  );
};
