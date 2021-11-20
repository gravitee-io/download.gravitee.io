const config = {
  bucketUrl: "https://download.gravitee.io",
  keyExcludePatterns: [/^index\.html$/],
  pageSize: 1000,
};

export async function fetchItemsS3(prefix, continuationToken) {
  const ignorePatterns = config.keyExcludePatterns;

  let bucketListApiUrl = buildUrl(prefix, continuationToken);
  let listBucketResultResponse = await fetch(bucketListApiUrl, {
    headers: new Headers({ Accept: "text/xml" }),
  });

  let listBucketResult = await parseResponse(listBucketResultResponse);

  const nextContinuationToken = nextContinuationTokenTag(listBucketResult);
  const page = getContent(listBucketResult);

  const nextPage = nextContinuationToken
    ? await fetchItemsS3(prefix, nextContinuationToken)
    : [];

  return [...page, ...nextPage].sort(sortContent());
}

function buildUrl(prefix, continuationToken) {
  const { bucketUrl, pageSize } = config;

  let bucketListApiUrl = `${bucketUrl}?list-type=2`;
  bucketListApiUrl += `&delimiter=/`;
  bucketListApiUrl += `&prefix=${prefix}`;

  if (pageSize) {
    bucketListApiUrl += `&max-keys=${pageSize}`;
  }
  if (continuationToken) {
    bucketListApiUrl += `&continuation-token=${encodeURIComponent(
      continuationToken
    )}`;
  }
  return bucketListApiUrl;
}

async function parseResponse(response) {
  let listBucketResultXml = await response.text();

  let listBucketResult = new DOMParser().parseFromString(
    listBucketResultXml,
    "text/xml"
  );
  if (!listBucketResult.querySelector("ListBucketResult")) {
    throw Error(
      "List bucket response does not contain <ListBucketResult> tag!"
    );
  }

  return listBucketResult;
}

const mapPrefix = (prefix) => (tag) => {
  const name = prefixTag(tag).split("/").slice(-2)[0] + "/";

  return {
    type: "prefix",
    name,
    prefix: `#${prefix}${name}`,
  };
};

const mapContent = (bucketUrl) => (tag) => {
  const key = keyTag(tag);
  const size = sizeTag(tag);
  const dateModified = dateModifiedTag(tag);

  let url = `${bucketUrl}/${key}`;

  return {
    type: "content",
    name: key.split("/").slice(-1)[0],
    size,
    dateModified,
    key,
    url,
  };
};

function getContent(result) {
  const { bucketUrl, keyExcludePatterns } = config;

  const currentPrefix = prefixTag(result);
  return [
    ...[...result.querySelectorAll("ListBucketResult > CommonPrefixes")]
      .filter(
        (tag) =>
          !keyExcludePatterns.find((pattern) => pattern.test(prefixTag(tag)))
      )
      .map(mapPrefix(currentPrefix)),
    ...[...result.querySelectorAll("ListBucketResult > Contents")]
      .filter(
        (tag) =>
          !keyExcludePatterns.find((pattern) => pattern.test(keyTag(tag)))
      )
      .map(mapContent(bucketUrl)),
  ];
}

function nextContinuationTokenTag(result) {
  let nextContinuationTokenTag = result.querySelector("NextContinuationToken");
  return nextContinuationTokenTag && nextContinuationTokenTag.textContent;
}

function prefixTag(tag) {
  return tag.querySelector("Prefix").textContent;
}

function keyTag(tag) {
  return tag.querySelector("Key").textContent;
}

function sizeTag(tag) {
  return parseInt(tag.querySelector("Size").textContent);
}

function dateModifiedTag(tag) {
  return new Date(tag.querySelector("LastModified").textContent);
}

function sortContent(columnName = "name") {
  return (rowA, rowB) => {
    // prefixes always first
    if (rowA.type !== rowB.type) {
      return rowA.type === "prefix" ? -1 : 1;
    }

    return sortByNameAndVersion(rowA[columnName], rowB[columnName]);
  };
}

function sortByNameAndVersion(fullNameA, fullNameB) {
  const valueA = splitName(fullNameA);
  const valueB = splitName(fullNameB);

  const nameCompare = valueA.name.localeCompare(valueB.name);
  if (nameCompare !== 0) {
    return nameCompare;
  }

  const majorCompare = compareNumbers(
    valueA.version?.major,
    valueB.version?.major
  );
  if (majorCompare !== 0) {
    return majorCompare;
  }

  const minorCompare = compareNumbers(
    valueA.version?.minor,
    valueB.version?.minor
  );
  if (minorCompare !== 0) {
    return minorCompare;
  }

  return compareNumbers(valueA.version?.patch, valueB.version?.patch);
}

function compareNumbers(i, j) {
  if (i > j) return -1;
  if (i < j) return 1;
  return 0;
}

const patternSplit =
  /(?<fileName>[\w-]*)-(?<version>\d.*)(.zip.md5|.zip.sha1|.zip)/;

function splitName(fullName) {
  const split = patternSplit.exec(fullName);
  if (split == null) {
    return { name: fullName };
  }

  const name = split[1];
  const version = splitVersion(split[2]);
  const ext = split[3];

  return {
    name,
    version,
    ext,
  };
}

function splitVersion(version) {
  const split = version.split(".");
  return {
    major: parseInt(split[0]),
    minor: parseInt(split[1]),
    patch: parseInt(split[2]),
  };
}
