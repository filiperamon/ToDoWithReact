import React, { Component } from 'react'
import axios from 'axios'

import PageHeader from '../template/pageheader'
import TodoForm from './todoForm'
import TodoList from './todoList'

const URL = 'http://localhost:8000/api/todos' 

export default class Todo extends Component{
    
    constructor(props) {
        super(props)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMarkDone = this.handleMarkDone.bind(this)
        this.handleMarkAsPading = this.handleMarkAsPading.bind(this)
        this.handleSearch = this.handleSearch.bind(this)

        this.state = { description: '', list: [] }

        this.refresh()
    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${description}/` : ''
        axios.get(`${URL}?sort=-createdAt${search}`)
             .then(resp => this.setState({ ...this.state, description: description, list: resp.data }))
    } 

    handleAdd() {
        const description = this.state.description
        axios.post(URL,{ description })
            .then(resp => this.refresh())
    }
    
    handleChange(e){
        this.setState({ ...this.state, description: e.target.value })        
    }

    handleMarkDone(todo){
        axios.put(`${URL}/${todo._id}`, {...todo, done:true})
            .then(resp => this.refresh(this.state.description))
    }

    handleRemove(todo){
        axios.delete(`${URL}/${todo._id}`)
            .then(resp => this.refresh(this.state.description))
    }

    handleMarkAsPading(todo) {
        axios.put(`${URL}/${todo._id}`,{...todo, done:false})
            .then(resp => this.refresh(this.state.description))
   }

   handleSearch() {
        this.refresh(this.state.description)
   }

    render(){
        return (
            <div>
                <PageHeader name="Tarefas" small="Cadastro" />
                <TodoForm 
                    description={this.state.description}
                    handleAdd={this.handleAdd}
                    handleChange={this.handleChange} 
                    handleSearch={this.handleSearch} />
                <TodoList 
                    list={this.state.list}
                    handleRemove={this.handleRemove} 
                    handleMarkDone={this.handleMarkDone}
                    handleMarkAsPading={this.handleMarkAsPading} />
            </div>
        )
    }
}