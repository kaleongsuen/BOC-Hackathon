var map;
var branchName = [];
var branch = [];
var nearestBranchName = ["", "", ""];
var isReady = false;
var dem = false;

var branchInfo = "";
readTextFile("branch.json");
console.log(branchInfo);
obj = JSON.parse(branchInfo);

var len = obj.length;
for (i = 0; i < len; i++)
{
	branchName.push(obj[i].name);
	branch.push({
		key: obj[i].name,
		value: [obj[i].address, obj.[i].opening_hours, obj[i].services]
	});
}

function GetBranchAddress(branchName)
{
	return branch[branchName].value[0];
}

function GetBranchServices(branchName)
{
	return branch[branchName].value[3];
}

function GetBranchOpeningHours(branchName)
{
	return branch[branchName].value[2];
}