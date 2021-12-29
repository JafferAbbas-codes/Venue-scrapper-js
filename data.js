var async = require("async");
var cheerio = require("cheerio");
const request = require("request");
// const mongoose = require("mongoose")
// const dotenv = require("dotenv")
const fs = require("fs");
const { data } = require("cheerio/lib/api/attributes");
const imageDownloader = require("image-downloader");

var urls = [
  "http://www.venuebazaar.pk/hall_details.aspx?value=2",
  "http://www.venuebazaar.pk/hall_details.aspx?value=7",
  "http://www.venuebazaar.pk/hall_details.aspx?value=32",
  "http://www.venuebazaar.pk/hall_details.aspx?value=10",
  "http://www.venuebazaar.pk/hall_details.aspx?value=11",
  "http://www.venuebazaar.pk/hall_details.aspx?value=15",
  "http://www.venuebazaar.pk/hall_details.aspx?value=17",
  "http://www.venuebazaar.pk/hall_details.aspx?value=19",
  "http://www.venuebazaar.pk/hall_details.aspx?value=20",
  "http://www.venuebazaar.pk/hall_details.aspx?value=21",
  "http://www.venuebazaar.pk/hall_details.aspx?value=22",
  "http://www.venuebazaar.pk/hall_details.aspx?value=23",
  "http://www.venuebazaar.pk/hall_details.aspx?value=24",
  "http://www.venuebazaar.pk/hall_details.aspx?value=25",
  "http://www.venuebazaar.pk/hall_details.aspx?value=26",
  "http://www.venuebazaar.pk/hall_details.aspx?value=27",
  "http://www.venuebazaar.pk/hall_details.aspx?value=28",
  "http://www.venuebazaar.pk/hall_details.aspx?value=29",
  "http://www.venuebazaar.pk/hall_details.aspx?value=5",
  "http://www.venuebazaar.pk/hall_details.aspx?value=6",
  "http://www.venuebazaar.pk/hall_details.aspx?value=9",
  "http://www.venuebazaar.pk/hall_details.aspx?value=30",
  "http://www.venuebazaar.pk/hall_details.aspx?value=12",
  "http://www.venuebazaar.pk/hall_details.aspx?value=13",
];
// var data = [];

var title,
  image,
  location,
  contact,
  min_capacity,
  max_capacity,
  description,
  max_price,
  min_price;

const json = {
  name: "",
  area: "",
  link: "",
  coverImage: "",
  imageOrigins: [],
  hallImages: [],
  address: "",
  contact: "",
  min_cap: "",
  max_cap: "",
  desc: "",
  min_rent: "",
  max_rent: "",
  facility: [],
};
let allCoverImages = [];
output = {
  events: [],
};

// dotenv.config()
var dataObject = [];
var facObject = [];
var count = 0;

async function calls() {
  var options = {
    method: "POST",
    url: "http://www.venuebazaar.pk/Search_Hall.aspx",
    headers: {
      Connection: "keep-alive",
      "Cache-Control": "max-age=0",
      "Upgrade-Insecure-Requests": "1",
      Origin: "http://www.venuebazaar.pk",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      Referer: "http://www.venuebazaar.pk/Search_Hall.aspx",
      "Accept-Language": "en-US,en;q=0.9",
      Cookie:
        "_ga=GA1.2.1325173426.1635752154; _fbp=fb.1.1637644029941.1460642375; ASP.NET_SessionId=thxhhrpsgipawamnht3bmw2e; _gid=GA1.2.1519472304.1640237205; _gat=1; _gali=ContentPlaceHolder1_Lb_Searchwv",
    },
    form: {
      __EVENTTARGET: "ctl00$ContentPlaceHolder1$Lb_Searchwv",
      __EVENTARGUMENT: "",
      __LASTFOCUS: "",
      __VIEWSTATE:
        "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",
      __VIEWSTATEGENERATOR: "3DB39A2D",
      __EVENTVALIDATION:
        "oHS2ITbXihZe6rQxhhbiLFlp4yoZjRd8sDITWlP2bOsPpY2xOBkimhCgz6no3EwqlVql30EAtZkQUowD7lKfR3pnOYO/NnJ5F03pgFLNtEFKl1arkJTezIeQx4ZLTUNJkHqtTqZSC7jzw63jnYdzXSmzumumGVci8ig6r7QKtcXuUNgy7OlFxqWQ8xka1F1JR0G/51+JQb71SHrf/2+5bSHEMWJrPr89i63wI2t2lfR83hM/P7CDcy7JtmnmkPzMlKXlwxjpeyssPKg4ozWNqfChQ+g5K/H1h7ENYuxmkQ4hS/krn1RlWxPUE7fylhFcBaLJt7OdMp8SM8R92lbH1/1JYIdMEoyVrwkPBl28FXIPaNTwc9izAjnoWcITWrtLu1RwTXenhn63dt8H9U47CQUeGSTemFfwWVU+YkjtjjF62k2A0lYf6Ugm7T9wMdljsyijKfMpNbPCtGUSwex/0rBrwyAITjIyG4KJlAZkpZ4EdSIWIwPVFpsv9DpzUvSHMZLiZOntMOR2whKKL38ScWKPJdVJ9/7XL3YMWIduKQ2yEq+Kzx688wksV779UKF6",
      // 'ctl00$ContentPlaceHolder1$city': '1',
      // 'ctl00$ContentPlaceHolder1$area': '1',
      // 'ctl00$ContentPlaceHolder1$area': '3',
      // 'ctl00$ContentPlaceHolder1$area': '5',
      // 'ctl00$ContentPlaceHolder1$area': '8',
      // 'ctl00$ContentPlaceHolder1$area': '10',
      // 'ctl00$ContentPlaceHolder1$area': '11',
      // 'ctl00$ContentPlaceHolder1$area': '12',
      // 'ctl00$ContentPlaceHolder1$area': '13',
      // 'ctl00$ContentPlaceHolder1$area': '14',
      // 'ctl00$ContentPlaceHolder1$area': '15',
      // 'ctl00$ContentPlaceHolder1$area': '18',
      // 'ctl00$ContentPlaceHolder1$area': '19',
      // 'ctl00$ContentPlaceHolder1$area': '1019',
      ctl00$ContentPlaceHolder1$minrent: "10000",
      ctl00$ContentPlaceHolder1$maxrent: "1300000",
      ctl00$ContentPlaceHolder1$minguest: "50",
      ctl00$ContentPlaceHolder1$maxguest: "3000",
    },
  };

  request(
    options,
    // "http://www.venuebazaar.pk/Search_Hall.aspx",
    (error, response, body) => {
      if (error) {
        console.error("We've encountered an error:", error);
        return;
      }
      // console.log("response", response.body);
      count += 1;
      var $ = cheerio.load(body);
      // const button = $("#ContentPlaceHolder1_Lb_Searchwv");
      // console.log("button", button.html());

      const v = $(".col-md-3.col-sm-6.col-xs-6 > div");
      var coverImageUrls = [];
      v.children().map(async (i, child) => {
        // console.log("child",i,$.html(child))
        if (i % 2 == 0) {
          var venueDoc = cheerio.load($.html(child));

          let coverImageURL = venueDoc("img").attr("src");

          console.log(
            "coverImageURL",
            `coverImage_${coverImageURL.split("/").pop()}`
          );
          allCoverImages[i] = `coverImage_${coverImageURL.split("/").pop()}`;
          allCoverImages[i + 1] = coverImageURL;
          // allCoverImages.push(`coverImage_${coverImageURL.split("/").pop()}`);

          // coverImageUrls[
          //   coverImageURL.split("/").pop()
          // ] = `coverImage_${coverImageURL.split("/").pop()}`;

          // console.log("coverImage",`coverImage_${coverImageURL.split("/").pop().split(".")[0]}`);

          // json.coverImage =
          //   coverImageUrls[
          //     Number(coverImageURL.split("/").pop().split(".")[0])
          //   ];

          var myError;
          do {
            myError = false;
            try {
              await imageDownloader.image({
                url: `http://www.venuebazaar.pk/${coverImageURL}`,
                dest: `./images/coverImage_${coverImageURL.split("/").pop()}`,
              });
            } catch (e) {
              myError = true;
              console.log(
                `error occured while downloading ${
                  coverImageUrls[i / 2]
                }, trying again now!`,
                e
              );
            }
          } while (myError);
        }
        if (i % 2 == 1) {
          var venueDoc = cheerio.load($.html(child));

          const link = venueDoc(".text-darken").attr("href");
          var name = venueDoc(".thumb-title")
            .html()
            .split(">")[1]
            .split("</a")[0];
          const area = venueDoc(".mb0")
            .html()
            .split(">")[2]
            .split("\n")[0]
            .trim();

          request(
            `http://www.venuebazaar.pk/${link}`,
            async (error, response, body) => {
              if (error) {
                console.error("We've encountered an error:", error);
                return;
              }
              count += 1;
              var $ = cheerio.load(body),
                share = $(".theitemIwant").html();

              json.name = name;
              json.area = area;
              json.link = link;

              location = $("#ContentPlaceHolder1_address").filter(function () {
                var data = $(this);

                location = data.children().first().text();

                json.address = location;
              });

              contact = $("#ContentPlaceHolder1_UpdatePanel2").filter(
                function () {
                  var data = $(this);

                  contact = data.children().first().text().trim();

                  json.contact = contact;
                }
              );
              min_capacity = $(" #ContentPlaceHolder1_capacity").filter(
                function () {
                  var data = $(this);
                  var t = "100 to 550";
                  min_capacity = data.first().text().split(/ to +/);
                  //   max_capacity = data.first().text().split(/ to +/)
                  // console.log(min_capacity);
                  json.min_cap = Number(min_capacity[0].replace(/,/g, ""));
                  // console.log(max_capacity);
                  json.max_cap = Number(min_capacity[1].replace(/,/g, ""));
                }
              );

              description = $(".col-md-8").filter(function (ele) {
                var data = $(this);
                // description = data.first().text()

                var temp = data
                  .children("p")
                  .last()
                  .text()
                  .slice(/\w{5}/g)
                  .trim();
                // console.log("desc", temp);
                if (temp) {
                  // console.log(description);
                  json.desc = temp;
                }
              });

              min_price = $("#ContentPlaceHolder1_rent").filter(function () {
                var data = $(this);
                min_price = data.first().text().replace(/,/g, "");

                // console.log(
                //   "min_price",
                //   min_price,
                //   " and in Int =>",
                //   Number(min_price)
                // );
                json.min_rent = parseInt(min_price);
              });

              max_price = $("#ContentPlaceHolder1_perhead").filter(function () {
                var data = $(this);
                max_price = data.first().text().replace(/,/g, "");

                json.max_rent = Number(max_price);
              });
              var facilityArr = [];
              facility = $(".tab-content").filter(function () {
                var data = $(this);
                facility = data
                  .first(
                    ".booking-item-features booking-item-features-expand mb30 clearfix"
                  )
                  .text();

                //   facilityArr.push(facility)
                // console.log(facility);
                facilityArr.push(facility);
                json.facility = facilityArr;
              });

              facObject.push(Object.assign({}));

              var imagesArr = [];
              var myImages = [];
              $("img").each(async (index, image) => {
                var imageSrc = $(image).attr("src");
                // console.log("imageSrc", imageSrc, imageSrc.includes("Admin"));
                if (imageSrc.includes("Admin")) {
                  imagesArr.push(imageSrc);
                  let withOutSpaceName = name.replace(/ /g, "");
                  myImages.push(
                    `/images/hall/${withOutSpaceName}_${index}.jpg`
                  );
                  var myError2;
                  do {
                    myError2 = false;
                    try {
                      await imageDownloader.image({
                        url: `http://www.venuebazaar.pk/${imageSrc}`,
                        dest: `./images/${withOutSpaceName}_${index}.jpg`,
                      });
                    } catch (e) {
                      myError2 = true;
                      console.log(
                        `error occured while downloading ${withOutSpaceName}_${index}, trying again now!`,
                        e
                      );
                    }
                  } while (myError2);
                }
              });

              // adding the cover image src and origin src to hall images
              imagesArr.push(allCoverImages[i]);
              myImages.push(allCoverImages[i - 1]);

              json.imageOrigins = imagesArr;
              json.hallImages = myImages;
              json.coverImage = allCoverImages[i - 1];
              dataObject.push(Object.assign({}, json));
              // console.log("dataObject", dataObject);

              /////writing data into json file///////
              // if (count === 20) {
              fs.writeFile(
                "data.json",
                JSON.stringify(dataObject, null, 2),
                "utf-8",
                (err) => {
                  if (err) {
                    console.log("error while saving data into file");
                  } else {
                    console.log("Data Saved Successfully");
                  }
                }
              );
            }
            // }
          );
          // });
        }
      });
      // console.log("allCoverImages",allCoverImages.length,allCoverImages,)
    }
  );
}

////Reading data and printing on console/////

/**
=> Uncomment this peace of code when you want to read 
the data from file but for that you need to comment out above writefile code <=
*/

// fs.readFile('data.json', 'utf8', function(err, data){

//   // Display the file content
//   console.log(data);
// });

async.parallel([calls], () => {
  var fs = require("fs");
  var obj;
  // fs.readFile("data.json", "utf8", function (err, data) {
  //   if (err) throw err;
  //   obj = JSON.parse(data);
  // });
  /* YOUR CODE HERE */

  /////writing data into json file///////

  // fs.writeFile(
  //   "data.json",
  //   JSON.stringify(dataObject, null, 2),
  //   "utf-8",
  //   (err) => {
  //     if (err) {
  //       console.log("error while saving data into file");
  //     } else {
  //       console.log("Data Saved Successfully");
  //     }
  //   }
  // );
});
