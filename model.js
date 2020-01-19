var linear = require('linear-trainer');
var fs = require('fs'); 
var parse = require('csv-parse');
var csvData_tonnes=[];
var csvData_price=[];
var csvData_date=[];
var count =1;
var pred;
for(var i =0;i<25;i++){
  csvData_date[i]=count++;
}
    module.exports = {
      predictor : (dataset,val) => {
      fs.createReadStream(dataset+"-price.csv")
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        //console.log(csvrow);
        //do something with csvrow
        csvData_tonnes.push(Number(csvrow[1]));
        csvData_price.push(Number(csvrow[5]));
    })
    .on('end',function() {
      var x = csvData_date.map((e, i) => {
        return [e, csvData_tonnes[i]];
      });   
      
      linear.train(x,csvData_price)
      pred = Math.round(linear.predict([[31,val]]))
      return pred
    });
    }
  }