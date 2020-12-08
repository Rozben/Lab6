import React, { Component } from 'react';
import axios from 'axios';

class CurrencyExchange extends Component {

	componentDidMount(){
		window.addEventListener('load',this.handleLoad);
	}
	
	componentWillUnmount(){
		window.removeEventListener('load',this.handleLoad);
	}
	
	handleLoad(){
		document.getElementById('datePckr').valueAsDate = new Date();
		let forbid = [31,57,58,59,60];
		
		axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
			.then(response => { 
				for(let i = 0; i < response.data.length; i++){
					if (i === forbid[0] || i >= forbid[1]) continue;
					document.getElementById('curr1').add(new Option(response.data[i].txt, response.data[i].cc));
					document.getElementById('curr2').add(new Option(response.data[i].txt, response.data[i].cc));
				}
			});
	}
	
	dateChanged(){
		this.setState({date: document.getElementById('datePckr').value})
	}
	
	curr1Changed(){
		this.setState({curr1: document.getElementById('curr1').value})
	}
	
	curr2Changed(){
		this.setState({curr2: document.getElementById('curr2').value})
	}

	calcClick(){
		let sCur1 = document.getElementById('curr1'), sCur2 = document.getElementById('curr2'), datePckr = document.getElementById('datePckr'), c1A = document.getElementById('curr1Amount'), c2A = document.getElementById('curr2Amount');
		
		if(c1A.value <= 0){
			document.getElementById('validText').textContent = "Кількість має бути позитивним числом";
			c2A.value = '';
			return;
		}
		else if(isNaN(c1A.value)){
			document.getElementById('validText').textContent = "Кількість має бути числом";
			c2A.value = '';
			return;
		}
		
		else{
			document.getElementById('validText').textContent = "";
		}
		
		
		let date = datePckr.value, tmp = date.split('-'); date = tmp[0] + tmp[1] + tmp[2];
		let currCode1 = sCur1.options[sCur1.selectedIndex].value, currCode2 = sCur2.options[sCur2.selectedIndex].value;
		let url1 = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=' + currCode1 + '&date=' + date + '&json', 
			url2 = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=' + currCode2 + '&date=' + date + '&json';
		let curr1Amount = 0, curr2Amount = 0;
		
		if(currCode1 !== "UAH" && currCode2 !== "UAH"){
			axios.get(url1).then(response => { curr1Amount = response.data[0].rate });
			axios.get(url2).then(response => { curr2Amount = response.data[0].rate; c2A.value = curr1Amount * c1A.value / curr2Amount });		
		}
		
		else if (currCode1 === currCode2){ c2A.value = c1A.value }
		
		else if(currCode1 === "UAH"){
			axios.get(url2).then(response => { curr2Amount = response.data[0].rate; c2A.value = c1A.value / curr2Amount });
		}
		
		else if(currCode2 === "UAH") {
			axios.get(url1).then(response => { curr1Amount = response.data[0].rate; c2A.value = curr1Amount * c1A.value });
		}
	
	}
	
	constructor(){
		super();
		this.calcClick = this.calcClick.bind(this);
		this.dateChanged = this.dateChanged.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.state = {	}
	}
	
	render(){
		return (
			<div className = 'ex_body'>
				<div className = 'ex_input'>
					<div>
						<label>Дата</label>
						<input id='datePckr' type='date' onChange={this.dateChanged}/>
					</div>
					<div>
						<label>Обміняти валюту</label>
						<select id='curr1'>
							<option value='UAH'>Гривна</option>
						</select>
					</div>
					
					<div>
						<label>В кількісті</label>
						<input id='curr1Amount'/>
					</div>	
					
					<div>
						<label>На валюту</label>
						<select id='curr2'>
							<option value='UAH'>Гривна</option>
						</select>
					</div>			
					<button id='confirm' onClick={this.calcClick}>Calculate</button>
				</div>
				
				<div className = 'ex_output'>
					<label>Результат</label>
					<input id='curr2Amount'/>
					<p id = 'validText'></p>
				</div>
			</div>
		)
	}
}

export default CurrencyExchange;