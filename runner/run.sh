#!/bin/sh

PROJECTROOT=$(cd $(npm root)/..  && pwd)
echo $PROJECTROOT

OUTPUTDIR="$PROJECTROOT/.suiteness"
mkdir -p $OUTPUTDIR

$(npm bin)/nyc node $PROJECTROOT/index $OUTPUTDIR
