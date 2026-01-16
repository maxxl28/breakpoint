import Post from './Post.jsx'

const Posts = ({ AppList }) => {
  
  return (
    <div>
      {AppList.map(value => <Post key={value.id} App={value}/>)}
    </div>
  )
}

export default Posts