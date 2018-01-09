#!/bin/bash
function check_result(){
  if [ "$1" != "0" ]
  then
    echo "出错了，请检查！";
    exit 2;
  fi
}

gulp build --s=iov-display-platform;

cd /data/projects/foton/platform-display-web/src/main/webapp;
rm -rf addedValue.html index.html monitor.html login.html assets js css rev;

cp -rf /data/projects/foton/iov-web-mobile/h5/dist/iov-display-platform/* .;

git add -A;
git commit -m "update";
git push;
