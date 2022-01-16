import logo from './logo.svg';
import './App.css';
import { Upload, message, Button, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Layout, { Header, Footer, Sider, Content} from 'antd/lib/layout/layout';
import { Menu, Dropdown, Input, Form } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import LanguageSelect from './LanguageSelect';
import ReactDOM from "react-dom";
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import Column from 'antd/lib/table/Column';
import axios from 'axios';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    lng: document.querySelector("html").lang,
    fallbackLng: "en",	// In case the language chosen does not exist
	detection: {
		order: ['cookie', 'localStorage', 'sessionStorage', 'path', 'subdomain'],
		caches: ['cookie']
	},
	backend: {
		loadPath: 'assets//locales/{{lng}}/{{ns}}.json',
	},
	//react: {useSuspense: false }
  });

const style = {
	color: 'white'
}


const languages = [
	{
		lang: "English",
		target: "en"
	},
	{
		lang: "Spanish",
		target: "es"
	},
	{
		lang: "Japanese",
		target: "jp"
	}
];

const menu = (
			<Menu>
				{languages.map( language => {
					return <Menu.Item key={language.target}>
						<a target="_blank" onClick={e => {
							document.querySelector("html").setAttribute("lang", language.target);
							i18next.changeLanguage(language.target);
							//window.location.reload();
						}}>
							{language.lang}
						</a>
					</Menu.Item>
				})}
			</Menu>
);

const props = {
  name: 'file',
  action: 'https://run.mocky.io/v3/4114a191-576e-48a4-a7ce-8b4162704577',
  headers: {
    "Content-Type": "application/json; charset=UTF-8"
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

async function uploadFile(info) {
	if (info.file.status !== 'uploading') {
		console.log(info.file, info.fileList);

		var formData = new FormData();
		formData.append("file", info.file);

		await axios.post('http://echo.jsontest.com/key/value/one/two', formData, {
			headers:  {
				"Content-Type": "application/json; charset=UTF-8",
			},
		}).then( response => {
			return response.data;
		}).then(data => {
			console.log(data);
			info.file.status = 'done';
		}).catch(error => {
			info.file.status = 'error';
			console.log(error.response.data.error);
		});
	}

	if (info.file.status === 'done') {
	message.success(`${info.file.name} file uploaded successfully`);
	} else if (info.file.status === 'error') {
	message.error(`${info.file.name} file upload failed.`);
	}
}

// Cite: https://www.tutorialrepublic.com/javascript-tutorial/javascript-cookies.php
function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if not found
    return null;
}

function reRender() {
	this.forceUpdate();
}

const onFinish = async (values) => {
	const user_lang = ( getCookie("i18next") != null ) ? getCookie("i18next") : 'en';
	values.lang = user_lang;
	values.amount = 5;

	console.log(values);

	// The URL that will be sent
	const init_url = "";
	const last_url = `/${values.query}/${values.amount}/${values.lang}`;

	// Sends to the Flask server and retrieves data
	await axios.get('http://echo.jsontest.com/key/value/one/two', values, {
		headers:  {
			"Content-Type": "application/json; charset=UTF-8",
		},
	}).then( response => {
		return response.data;
	}).then(data => {
		console.log(data);
	}).catch(error => {
		console.log(error);
	});
};

function App() {
	const { t } = useTranslation();
	const [form] = Form.useForm();

  return (
		<>
			<Layout>
				<Header>
					<Row justify='end'>
						<Col className="gutter-row">
						<Dropdown overlay={menu}>
							<a className="ant-dropdown-link" style={style} onClick={e => e.preventDefault()}>
								{t("Language")} <DownOutlined />
							</a>
						</Dropdown>
						</Col>
					</Row>
				</Header>
				<Layout className='main-content'>
					<h2>{t('Welcome')}</h2>
					<Form form={form} name="control-hooks" onFinish={onFinish}>
						<Form.Item name="query" label={t("Query")} rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
							{t('Submit')}
							</Button>
						</Form.Item>
					</Form>
				</Layout>
				<Footer>
					<Row justify='center'>
						<Col className='gutter-row'>
							<p>2021 CruzHacks</p>
						</Col>
					</Row>
				</Footer>
			</Layout>
		</>
  );
}

export default App;
