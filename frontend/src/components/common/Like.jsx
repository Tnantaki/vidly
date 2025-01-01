import React, { Component } from 'react'

// Input  -> isLike: boolean
// Output -> onClick

class Like extends Component {
  render() { 
    const {isLiked, onLike} = this.props

    return (
      <i
        className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}
        style={{ cursor: "pointer" }}
        onClick={onLike}
      ></i>
    );
  }
}
 
export default Like;