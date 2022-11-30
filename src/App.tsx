import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
 atom, useRecoilState, useRecoilValue, useSetRecoilState
} from 'recoil';


interface ITodoItem {
  [key: string]: any
  // id: number,
  // text: string,
  // isComplete: boolean
}

const todoListState = atom<ITodoItem[]>({
  key: 'todoListState',
  default: [],
})

function App() {
  //state값 읽어오기
  const todoList = useRecoilValue(todoListState)

  {console.log(
    todoList.map((item)=>{console.log(item)})
  )}     
  return (
    <div className="App">
      <TodoItemCreater />      
      {todoList.map((item: ITodoItem)=>(
        <TodoItem item={item}/>
      ))}
    </div>
  );
}

function TodoItemCreater(){
  const [inputVal,setInputVal] = useState('');
  //todoListState 업데이트
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList) => [...oldTodoList,{
      id: getId(),
      text: inputVal,
      isComplete: false,
    }])
    setInputVal('')
  }

  const onChange = ({target:{value}}:React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(value)
  }

  return(
    <div>
      <input type="text" value={inputVal} onChange={onChange} width="100%"/>
      <button onClick={addItem}>등록</button>
    </div>
  )
}



function TodoItem( {item} : ITodoItem) {
  
  console.log(item)
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = ({target: {value}}:React.ChangeEvent<HTMLInputElement>) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value,
    });

    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
}

function replaceItemAtIndex(arr: ITodoItem[], index: number, newValue: ITodoItem) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr:ITodoItem[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}



export default App;


// 고유한 Id 생성을 위한 유틸리티
let id = 0;
function getId() {
  return id++;
}
