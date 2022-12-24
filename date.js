exports.day = function () {
const today = new Date();
    const option = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Hong_Kong",  
  };
      return today.toLocaleDateString("en-US", option);

};

exports.listDay = function () {
  const today = new Date();
  const option2 ={
        day: "numeric",
        month:"short",
        year: "numeric", 
        timeZone: "Asia/Hong_Kong", 
      };
      return today.toLocaleDateString("en-US", option2);


}
