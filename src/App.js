import logo from './logo.svg';
import './App.css';
import { Upload, message, Button, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Layout, { Header, Footer, Sider, Content} from 'antd/lib/layout/layout';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import LanguageSelect from './LanguageSelect';
import ReactDOM from "react-dom";
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import Column from 'antd/lib/table/Column';

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

function App() {
	const { t } = useTranslation();

  return (
		<>
			<Layout>
				<Header>
					<Row justify='end'>
						<Col className="gutter-row">
						<Dropdown overlay={menu}>
							<a className="ant-dropdown-link" style={style} onClick={e => e.preventDefault()}>
								Language <DownOutlined />
							</a>
						</Dropdown>
						</Col>
					</Row>
				</Header>
				<Layout className='main-content'>
					<Upload {...props}>
						<h2>{t('Welcome to React')}</h2>
						<Button icon={<UploadOutlined />}>Click to Upload</Button>
					</Upload>
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
