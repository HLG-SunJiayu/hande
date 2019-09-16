import React from "react";
import ReactDOM from "react-dom";

import "./App.css";

const Component = () => <div class="jiaoyu">
<div class="jingli">
<main>
        <form name="myForm" action="index.js" onsubmit="return validateForm()" method="post">
          <div>  
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><span>*</span>&nbsp;教育阶段：</label>
          <select>
            <option >小学</option>
            <option>中学</option>
            <option>本科</option>
            <option>专科</option>
          </select>
          </div>
          <br/>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><span>*</span>&nbsp;学校：</label>
          <select>
            <option>北京理工大学</option>
            <option>哈尔滨理工大学</option>
          </select>
          </div>
          <br/>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><span>*</span>&nbsp;起止时间：</label>
          <input type="text" name="fname" placeholder="2018-12-19"/> &nbsp;&nbsp;至&nbsp;&nbsp; <input type="text" name="firstname" placeholder="2018-12-20"/>
          </div>
          <br/>
          <div>
          <label><span>*</span>&nbsp;第一学位专业：</label>
          <input type="text" name="firstname" placeholder="请填写第一学位专业"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <label><span>*</span>&nbsp;第一学位GPA：</label>
          <input type="text" name="firstname" placeholder="请填写第一学位GPA"/>
          </div>
          <br/>
          <div>
          <label><span>*</span>&nbsp;第一学位排名：</label>
          <select>
            <option>第一</option>
            <option>第二</option>
            <option>第三</option>
          </select>
          </div>
          <br/>
          <div>
          <label>第二学位专业：</label>
          <input type="text" name="firstname" placeholder="请填写第二学位专业"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <label>第二学位GPA：</label>
          <input type="text" name="firstname" placeholder="请填写第二学位GPA"/><hr/>
          </div>
          <br/>
        </form>
      </main>
</div>
</div>
function validateForm()
{
  var x=document.forms["myForm"]["fname"].value;
  if (x==null || x=="")
  {
    alert("必须填写");
    return false;
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { comps: [] };
  }
  
  render() {
    const { comps } = this.state;
    return (
      <div class="jingli">
        {comps.map(comp => {
          return <Component key={comp} />;
        })}
        
        <button class="add" onClick={() => this.setState({ comps: comps.concat([Date.now()]) })}>添加教育经历</button>
        <div class="anniu">
        <input type="submit" value="保存并提交" class="tijiao"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input type="reset" value="取消" class="quxiao"/>
        </div>
        
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);