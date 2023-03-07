import React, { Component } from "react";
import axios from "axios";
import './components/Left.css'
import Styles from './components/Styles'
import './App.css'
import { canvas } from "canvas";
import { flushSync } from 'react-dom';



class App extends Component{

	canvaCordX = ''
	canvaCordY = ''
	isCrop = 0
	theCropsCord = []
	tkhrbiqa = 0
	mainImage  = ''
	contextCrops = []

    constructor(props){
      super(props);
      this.state = {
        collection: [],
        view: '',
        instru:'',
        qanva:[]
      }


      this.selectOnlyThis = this.selectOnlyThis.bind(this)
      this.chooseInstruction = this.chooseInstruction.bind(this)
      this.cropCenter = this.cropCenter.bind(this)
      this.qsstiKanvaDown = this.qsstiKanvaDown.bind(this)
      this.qsstiKanvaUp = this.qsstiKanvaUp.bind(this)
      this.qsstiKanvaMove = this.qsstiKanvaMove.bind(this)
      this.deleteCrop = this.deleteCrop.bind(this)
      
    }


    cropCenter(event){
    	console.log('BRKTI F TSWIRA')
    	console.log('X ',event.clientX,' -- Y ',event.clientY)
    }


    selectOnlyThis(event){
      var myCheckbox = document.getElementsByName("myCheckbox");
      Array.prototype.forEach.call(myCheckbox,function(el){
        el.checked = false;  
      });
      event.target.checked = true;
      this.setState({view : event.target.id})
    }

    chooseInstruction(event){
    	this.instruId = event.target.id
    	// this.render()
    	flushSync(() => {
	      this.setState({instru : event.target.id})
	    })
	    this.friKanva()
      
    }


    componentDidMount() {
      this.refreshList();
    }

    

    refreshList = () => {
      axios
        .get("/api/Instructions/")
        .then((res) => this.setState({ collection: res.data }))
        .catch((err) => console.log(err));
    };

    getCollectionData(state) {
	  const data = this.state.collection;
	  const firstRow = data[0];
	  const restCollec = [];
	  const firstCollecArray = [];

	  for (let i = 1; i < data.length; i++) {
	    if (!restCollec.includes(data[i].collection) && data[i].collection !== firstRow.collection) {
	      restCollec.push(data[i].collection);
	    } else if (firstCollecArray.length < 1) {
	      firstCollecArray.push(data[i].collection);
	    }
	  }

	  const viewCollec = [];
	  for (let i = 0; i < data.length; i++) {
	    if (data[i].collection === state.view) {
	      viewCollec.push(data[i]);
	    }
	  }

	  let currentInstru = [];
	  for (let i = 0; i < data.length; i++) {
	    if (Object.is(data[i].id , Number(this.instruId))) {
	      currentInstru = data[i];
	    }
	  }

	  return [firstCollecArray, restCollec, viewCollec, currentInstru];
	}

	NavBar() {
		return(
				<nav className="navbar navbar-inverse navbar-fixed-top" >
			        <div className="container-fluid">
			          <div className="navbar-header">
			            <a  href="navDatano" className="navbar-brand" >DATANO API - Image Annotation</a>
			          </div>
			        </div>
		        </nav>
		)
	}
	  
	Left(data)
	{
		var [firstCollecArray, restCollec, viewCollec  ] =[ data[0] , data[1] , data[2] ] ;
		return(

              <div className="col-lg-2 border">


                <div className="col border">
                  <div className="row border">
                      Objects :
                      
                  </div>

                  <div id='zbi' className="row border">
                    <div className="col border">
                        { firstCollecArray.map((item,index) => { return <div className="row" key={item.toString()}><input type="checkbox" name="myCheckbox" id={item.toString()} onClick={this.selectOnlyThis} /><label>{item.toString()}</label></div>; }) }
                        { restCollec.map((item,index) => { return <div className="row" key={item.toString()}><input type="checkbox" name="myCheckbox" id={item.toString()} onClick={this.selectOnlyThis}  /><label>{item.toString()}</label></div>; }) }
                    </div>
                  </div>
                </div>

                <div className="col" style={{height : '40px'}}></div>

                <div className="col border">
                    <div className="row border">
                      Up Next 
                    </div>
                    <div className="row border">
                      
                      <div className="col border">
                      	<div className="row" style={{height:'20px'}}></div>
                        {viewCollec.map((item,index) => { return <div className="row" key={item.id.toString()}><div className="col"><img alt={item.taskId.toString()} src={item.src.toString()} id={item.id.toString()} style={{width:'100%'}} onClick={this.chooseInstruction} onDrag={this.dragView} /><div style={{height:'20px'}}></div></div></div>; }) }
                      </div>
                      
                    </div>
                </div>
                
                
              </div>

      )
	}

	qsstiKanvaDown(event){
		var nva = document.querySelector('#finTrssm')
		

		// fix the height later and the width ::: 
		console.log('NAV HEIGHT ',document.querySelector('nav').height)
		this.canvaCordX = (event.pageX - (window.innerWidth*(2/12)))
		this.canvaCordY = (event.pageY - 102)

		console.log('Qssti kanva ', event.pageX , event.pageY)
		this.isCrop = 1
	}

	qsstiKanvaMove(event){
		if (this.isCrop == 1) {
			var canvas = document.querySelector('#finTrssm');
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			var width = (event.pageX-this.canvaCordX-(window.innerWidth*(2/12)))*(((7/12)*(window.innerWidth))*(img.height)/(img.width))
			var height = ((event.pageY-this.canvaCordY-102))
			context.rect(this.canvaCordX , this.canvaCordY , width , height);
			context.globalAlpha = 0.3
			context.fillStyle = "#FF0000";
			context.fill();
			this.contextCrops.push(context)
		}
		
	}

	qsstiKanvaUp(event){
		this.isCrop = 0
		const  rayCord = [ Number(this.canvaCordX) , Number(this.canvaCordY) , event.pageX-this.canvaCordX-280 , event.pageY-this.canvaCordY-102 ]
		this.theCropsCord.push(rayCord)
	}
	
	deleteCrop(){
		const qhba = this.theCropsCord
		console.log('Length dyal had zbi ', qhba.length)
		console.log('Had zbi ',qhba)
		if (qhba.length>0) {
			var [cropX , cropY , cropWidth , cropHeight ] = qhba[qhba.length-1]

			var cropHayd = this.contextCrops[this.contextCrops.length-1]
			cropHayd.clearRect(0, 0, 10000, 10000);



			var img = this.mainImage

			const canvas = document.createElement('canvas');
		  	canvas.width = cropWidth;
		 	canvas.height = cropHeight;
		  	const ctx = canvas.getContext('2d');

		  	ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);


		  	const croppedImg = new Image();
	  		croppedImg.src = canvas.toDataURL();

	  		console.log('Ha limage cropped ',croppedImg)

	  		document.querySelector('#cropat').appendChild(croppedImg);
		}

	}




	Kanva(currInstru){
		return(
			
				<div id="central" className="row border">
					
	                <canvas id="imgCanva" style={{width: '100%' , height: '100%'}} >

						<div className="col border" id="lol"  style={{position: 'relative'}}  onClick={this.cropCenter} ></div>

					</canvas>
					<canvas id="finTrssm" style={{width: '100%' , height: '100%'}} onMouseDown={this.qsstiKanvaDown} onMouseUp={this.qsstiKanvaUp} onMouseMove={this.qsstiKanvaMove} ></canvas>

					
	            </div>
	        
		)

		
	}


	friKanva(currInstru){
		var nva = document.querySelector('#imgCanva')

		var rssm = document.querySelector('#finTrssm')

		var cntrl = document.getElementById('central')
		console.log('CENTRAL DZEB ',cntrl)
		
		// var img = document.querySelector('#mainimage')
		if(nva && currInstru) {
			var ctx1 = nva.getContext("2d");
			var ctx2 = rssm.getContext("2d");
			var img = new Image()
			
			console.log('HA CURR LI KHSS ITRSSEM ',currInstru)
			img.onload = function(){
				ctx1.canvas.width = img.width;
  				ctx1.canvas.height = img.height;
				ctx2.canvas.width = img.width;
  				ctx2.canvas.height = img.height;
				console.log('Image dimensions ', img.width , img.height)				 
				cntrl.style.height = (((7/12)*(window.innerWidth))*(img.height)/(img.width)).toString()+"px"
				ctx1.drawImage(img,0,0);  

			}
			img.src = currInstru.src
			this.mainImage = img
		}
	}


	Center(currInstru) {

		console.log('Centerr cur dzeb ',currInstru)

		return (

			<div id="santr" className="col-lg-7 border">

	              <div className="row border">
	                
	              <div className="col border" style={{height:'45px'}}> Central picture {currInstru.instru} </div>
	              <button onClick={this.deleteCrop} >DELETE CROP</button>
	              </div>


	              	{this.Kanva(currInstru)}
	            	              	              


	              <div className="row border" style={{height:'30px'}}></div>


	              <div className="row border">
	                Message
	              </div>


	              {this.friKanva(currInstru)}
	         </div>

		)
	}



	Right(currentInstru){
		return(
			<div className="col-lg-3 border">
	            
	            <div className="col border">
					<div className="row">
		            	Info 
		        	</div>
		            <div className="row border">
		            	<div className="col border">
			            	<div className="row border">
			            		Instruction : {currentInstru.instru}
			            	</div>
			            	<div className="row border">
			            		Task ID : {currentInstru.taskId}
			            	</div>
			            	<div className="row border">
			            		Created At : {currentInstru.createdAt}
			            	</div>
			            	<div className="row border">
			            		Urgency : {currentInstru.urgency}
			            	</div>
			            	<div className="row border">
			            		Original Image : 
			            	</div>
			            </div>
		        	</div>
		        	
		        	
		        </div>


	            <div className="col" style={{height : '20px'}}></div>
	            

	            <div className="col border">
					<div id="cropat" className="row border">
			              Annotations 
			        </div>


			        <div className="row border" style={{height : '200px'}}>
			               
			        </div>
			    </div>
	        </div>
		)
	}






    render(){

    	var [firstCollecArray, restCollec, viewCollec, currentInstru] = this.getCollectionData(this.state)
    	console.log('Cuurent instru ',this.instru)

      return(

        <main className="container-fluid">


          {this.NavBar()}

          
          <div className="row border">


          		{this.Left([firstCollecArray, restCollec, viewCollec, currentInstru])}


          		{this.Center(currentInstru)}
	        
	            
	         	{this.Right(currentInstru)}


          </div>

          

        </main>

    )
  }

}




export default App ;

