import _ from 'lodash';
import './style.css';
import Icon from './icon.png';
import Data from './data.xml';
import printMe from './print.js';
function component() {
    let element = document.createElement('div');
    var btn = document.createElement('button');

    
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');
    // 将图像添加到我们已经存在的 div 中。
   var myIcon = new Image();
   myIcon.src = Icon;

   element.appendChild(myIcon);
   
   console.log(Data);

   btn.innerHTML = '点击这里，然后查看 console！';
   btn.onclick = printMe;

   element.appendChild(btn);


    return element;
  }
  
  document.body.appendChild(component());
  if (module.hot) {
       module.hot.accept('./print.js', function() {
         console.log('Accepting the updated printMe module!');
         printMe();
       })
     }