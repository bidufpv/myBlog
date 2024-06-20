import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      status: post?.status || '',
    }
  });

  const navigate = useNavigate();
  const userData = useSelector(state => state.user.userData);

  const submit = (data) => {
    if (post) {
      const uploadPromise = data.image[0] ? appwriteService.uploadFile(data.image[0]) : Promise.resolve(null);
      
      uploadPromise.then(file => {
        if (file) {
          appwriteService.deleteFile(post.featuredImage).then(() => {
            return appwriteService.updatePost(post.$id, 
            { ...data, featuredImage: file ? file.$id : undefined });
          }).then(dbPost => {
            if (dbPost) {
              navigate(`/post/${dbPost.$id}`);
            }
          });
        } else {
          appwriteService.updatePost(post.$id, 
          { ...data, featuredImage: undefined }).then(dbPost => {
            if (dbPost) {
              navigate(`/post/${dbPost.$id}`);
            }
          });
        }
      });
    } else {
      appwriteService.uploadFile(data.image[0]).then(file => {
        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;
          return appwriteService.createPost({
            ...data,
            userId: userData.$id,
          });
        }
      }).then(dbPost => {
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      });
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === 'string')
      return value
      .trim()
      .toLowerCase()
      .replace(/^[a-zA-Z\d\s]+/g, '_')
      .replace(/\s/g, '_');
    return ''
  }, []);

useEffect(()=>{
    const subscription = watch((value, {name})=>{
      if(name==='title'){
        setValue('slug', slugTransform(value.title, {shouldValidate: true}))
      }

    })
    return ()=>{
      subscription.unsubscribe()
    }
},[watch, slugTransform, setValue])

  return (
    <form className='flex flex-wrap' onSubmit={handleSubmit(submit)}>
      <div className='w-2/3 px-2'>

       <Input className='mb-4'
       label='Title:'
       placeholder='Title'
       {...register('title', {required:true})}
       />

      <Input className='mb-4'
      label='Slug:'
      placeholder='Slug'
      {...register('Slug',{required:true})}
      onInput={(e) => {
        setValue("slug", slugTransform(e.currentTarget.value),
        { shouldValidate: true });
    }}
      />

     <RTE label='content:' name='content' control={control}
     defaultValue={getValues('content')}/>      

      </div>
      <div className='w-1/3 px-2'>
        <Input
        className='mb-4'
        label='Featured Image:'
        type = 'file'
        accept='image/png, image/gif, image/jpg, image/jpeg'
        {...register('image',{required: !post})}
        />

        {post && (
          <div className='w-full mb-4'>
            <img src={appwriteService.getFilePreview(post.featuredImage)}
             alt={post.title} className='rounded-lg' />

          </div>
        )}

      <Select
      className='mb-4'
      options={['active', 'inactive']}
      label='status'
      {...register('status',{required:true})}
      />

    <Button
    className='w-full'
    type='submit' bgColor={post ?bg-green : undefined}>
      {post ? 'update' : 'submit'}
      </Button>

      </div>
    </form>
  );
}

export default PostForm;
