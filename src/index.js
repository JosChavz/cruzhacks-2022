import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.min.css'
import { Rings } from  'react-loader-spinner'

const style = {
	width: "100vw",
	height: "100vh",
	display: "flex",
	"justify-content": "center",
	"align-items": "center",
	"text-align": "center"
}

ReactDOM.render(
  <Suspense style={style} fallback={<Rings color="#00BFFF" height={80} width={80} />}>
		<App />
	</Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
