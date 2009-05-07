SRC_DIR = src
BUILD_DIR = build

MODULES_DIR = ${SRC_DIR}/modules

PREFIX = .
DIST_DIR = ${PREFIX}/dist
DOCS_DIR = ${PREFIX}/docs

BASE_FILES = ${SRC_DIR}/ignition.js\
	${SRC_DIR}/model.js\
	${SRC_DIR}/view.js\
	${SRC_DIR}/controller.js

MODULE_FILES = ${MODULES_DIR}/urlmanager.js\
	${MODULES_DIR}/historydispatcher.js

FINAL = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${MODULE_FILES}\
	${SRC_DIR}/outro.js

JSDOC_DIR = ${BUILD_DIR}/jsdoc-toolkit
JSDOC = java -jar ${JSDOC_DIR}/jsrun.jar ${JSDOC_DIR}/app/run.js -a -t=${JSDOC_DIR}/templates/jsdoc

PACK = java -jar -Dfile.encoding=utf-8 ${BUILD_DIR}/js.jar ${BUILD_DIR}/build/pack.js
MIN  = java -jar ${BUILD_DIR}/build/yuicompressor-2.4.2.jar

VERSION = `cat version.txt`
VER  = `cat version.txt`
DATE = `date`
TREE = `git log -1 --pretty=format:"%T"`

IGNT = ${DIST_DIR}/ignition.js
IGNT_MIN = ${DIST_DIR}/ignition.min.js
IGNT_PACK = ${DIST_DIR}/ignition.pack.js

all: ignition min
	@@echo "Ignition build complete"

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

ignition: ${DIST_DIR} ${IGNT}

${IGNT}: ${FINAL}
	@@echo "Building" ${IGNT}

	@@cat ${FINAL} | \
		sed 's/Date:./&'"${DATE}"'/' | \
		sed 's/Tree:./&'"${TREE}"'/' | \
		sed 's/@VERSION/'"${VER}"'/g' \
		> ${IGNT}

	@@echo ${IGNT} "Built"
	@@echo

pack: ${DIST_DIR} ${IGNT} ${IGNT_PACK}

${IGNT_PACK}: ${IGNT}
	@@echo "Building" ${IGNT_PACK}

	@@echo " - Compressing with Packer..."
	@@${PACK} ${IGNT} ${IGNT_PACK}

	@@echo ${IGNT_PACK} "Built"
	@@echo

min: ${DIST_DIR} ${IGNT} ${IGNT_MIN}

${IGNT_MIN}: ${IGNT}
	@@echo "Building" ${IGNT_MIN}

	@@echo " - Compressing with YUI Compressor..."
	@@${MIN} ${IGNT} > ${IGNT_MIN}

	@@echo ${IGNT_MIN} "Built"
	@@echo

${DOCS_DIR}:
	@@mkdir -p ${DOCS_DIR}

jsdoc: ${DOCS_DIR}
	@@echo "Generating jsdocs in" ${DOCS_DIR}

	@@${JSDOC} -r=2 -d=${DOCS_DIR} --exclude="intro|outro" ${SRC_DIR}

	@@echo "jsdocs generated"
	@@echo


clean:
	@@echo "Removing dist directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing docs directory:" ${DOCS_DIR}
	@@rm -rf ${DOCS_DIR}
