import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Container} from 'react-bootstrap';


export default class TextEditor extends React.Component{
  render() {
    return (
      <div>
        <Container className="ml-3" >
          <ReactQuill theme="snow"/>
        </Container>
      </div>
    )
  }
}
