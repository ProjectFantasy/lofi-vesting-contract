pragma solidity ^0.8.0;
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract Vesting is Ownable {
    using SafeMath for uint256;

    address private _beneficiary;
    IERC20 private _token;

    uint256 private _sentAmount = 0;
    uint256 private _totalAmount = 0;

    bool private _isPreparedStage = true;

    struct Stage {
        uint256 releaseTime;
        uint256 amount;
    }
    Stage[] private _stages;

    event TokenSent(uint256 amount, uint256 timestamp);
    event Staged(uint256[] timestamps, uint256[] amounts);
    event Beneficiary(address beneficiary);
    event TotalAmountChanged(uint256 totalAmount);

    constructor(
        address initBeneficiary,
        address token,
        uint256 totalAmount
    ) Ownable() {
        _token = IERC20(token);
        _beneficiary = initBeneficiary;
        _totalAmount = totalAmount;
    }

    modifier onlyBeneficiary() {
        require(msg.sender == _beneficiary, 'not beneficiary');
        _;
    }

    modifier onlyPreparedStage() {
        require(_isPreparedStage, 'not is prepare stage');
        _;
    }

    function setTotalAmount(uint256 newTotalAmount) public {
        _totalAmount = newTotalAmount;
        emit TotalAmountChanged(_totalAmount);
    }

    function totalAmount() public view returns (uint256) {
        return _totalAmount;
    }

    function updateToken(address newToken) public {
        _token = IERC20(newToken);
    }

    function token() public view returns (address) {
        return address(_token);
    }

    function pushStages(uint256[] calldata timestamps, uint256[] calldata amounts) public onlyOwner onlyPreparedStage {
        require(timestamps.length == amounts.length, 'Invalid timestamp and amounts');
        if (_stages.length > 0) {
            require(
                _stages[_stages.length - 1].releaseTime < timestamps[0],
                'Timetamps must be greater than previous timestamp'
            );
        }
        for (uint256 i = 0; i < timestamps.length; i++) {
            _stages.push(Stage(timestamps[i], amounts[i]));
        }

        emit Staged(timestamps, amounts);
    }

    function getStages() public view returns (Stage[] memory) {
        return _stages;
    }

    function resetStages() public onlyOwner onlyPreparedStage {
        delete _stages;
    }

    function getStageCount() public view returns (uint256) {
        return _stages.length;
    }

    function startVesting() public onlyOwner onlyPreparedStage {
        require(_token.balanceOf(address(this)) >= _totalAmount, 'Not enough balance');
        _isPreparedStage = false;
    }

    function updateBeneficiary(address newBeneficiary) public onlyOwner onlyPreparedStage {
        _beneficiary = newBeneficiary;
        emit Beneficiary(_beneficiary);
    }

    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    function release() external onlyBeneficiary {
        uint256 availableAmount = getAvailableAmount();
        require(availableAmount > 0, 'invalid_amount');
        sendToken(availableAmount);
    }

    function getAvailableAmount() public view returns (uint256) {
        uint256 availableAmount = 0;
        for (uint256 i = 0; i < _stages.length; i++) {
            if (block.timestamp >= _stages[i].releaseTime) {
                availableAmount = availableAmount.add(_stages[i].amount);
            }
        }

        availableAmount = availableAmount.sub(_sentAmount);
        return availableAmount;
    }

    function sendToken(uint256 _amount) internal {
        _sentAmount = _sentAmount.add(_amount);
        _token.transfer(_beneficiary, _amount);

        // emit event
        emit TokenSent(_amount, block.timestamp);
    }
}
