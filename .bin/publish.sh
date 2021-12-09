#!/usr/bin/env bash

ORG_NAME="gravitee-io"
BRANCH="${BRANCH:=main}"
DRY_RUN="${DRY_RUN:=true}"

JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"action\": \"publish\",
        \"dry_run\": ${DRY_RUN}
    }

}"

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/download.gravitee.io/pipeline | jq .
