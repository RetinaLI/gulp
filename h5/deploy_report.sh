#!/bin/bash
function check_result(){
  if [ "$1" != "0" ]
  then
    echo "出错了，请检查！";
    exit 2;
  fi
}

key1='周'
key2='月'
key3='福田商用车'
key4='福田新能源'

gulp build --s=report;

# rm -rf dist/report/assets/sas;
# cp -rf app/report/assets/sas dist/report/assets/;

cd dist/report;
rm -rf assets rev;
cp index.html platform_week_report1.html;

cp index.html platform_month_report.html;
sed -i "" "s/周/月/g" platform_month_report.html

cp index.html new_energy_week_report.html;
sed -i "" "s/福田商用车/福田新能源/g" new_energy_week_report.html

cp index.html new_energy_month_report.html;
sed -i "" "s/福田商用车/福田新能源/g" new_energy_month_report.html
sed -i "" "s/周/月/g" new_energy_month_report.html

rm index.html;

cd /data/projects/foton/platform-iov-web/src/main/webapp/pages/nosecurity/subscribe/sas;
rm -rf css js *.html;
cp -rf /data/projects/foton/iov-web-mobile/h5/dist/report/* .;

cp /data/projects/foton/iov-web-mobile/h5/oldreport/platform_week_report.html .;
cp /data/projects/foton/iov-web-mobile/h5/oldreport/js/* js/;
cp /data/projects/foton/iov-web-mobile/h5/oldreport/css/* css/;

git add -A;
git commit -m "update";
git push;
