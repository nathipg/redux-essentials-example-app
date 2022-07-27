import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addNewPost } from './postsSlice'

import { REQUEST_STATUS } from '../../shared/constants'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState(REQUEST_STATUS.IDLE);

  const dispatch = useDispatch()

  const users = useSelector(state => state.users)

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setUserId(e.target.value)

  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === REQUEST_STATUS.IDLE;

  const onSavePostClicked = async () => {
    if(canSave) {
      try {
        setAddRequestStatus(REQUEST_STATUS.LOADING);

        const newPost = {
          title,
          content,
          user: userId,
        };

        await dispatch(addNewPost(newPost)).unwrap();

        setTitle('');
        setContent('');
        setUserId('');
      } catch(err) {
        console.error('Failed to save the post: ', err);
      } finally {
        setAddRequestStatus(REQUEST_STATUS.IDLE);
      }
    }
  };
  
  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
      </form>
    </section>
  )
}