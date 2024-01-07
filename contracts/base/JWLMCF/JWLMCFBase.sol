// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../../libs/Snippets.sol";
import "./IJWLX.sol";
import "../JWLXTKN/JWLXTKNFactoryBase.sol";

contract JWLMCFBase is Ownable, ReentrancyGuard {
    using Snippets for *;

    using SafeERC20 for *;

    using Math for uint256;

    struct UserInfo {
        uint256 amount;
        uint256 pendingReward;
    }

    struct PoolInfo {
        IJWLX lpToken;
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 rewardTokenPerShare;
    }

    IJWLX public jwlx;
    address public developerTreasuryWalletAccount;
    uint256 public jouelTokenRewardPerBlock;

    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    uint256 public totalAllocation = 0;
    uint256 public startBlock;
    uint256 public BONUS_MULTIPLIER;
    event PendingReward(uint256 currentBlock, uint256 poolLastRewardBlock, uint256 lpToken, uint256 reward, uint256 userAmount, uint256 rewardPerSare, uint256 userPendingReward);
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    constructor(
        IJWLX _jwlx,
        address _developerTreasuryWalletAccount,
        uint256 _jouelTokenRewardPerBlock,
        uint256 _startBlock,
        uint256 _multiplier,
        uint256 _allocPoint
    ) Ownable(_msgSender()) {
        jwlx = _jwlx;
        developerTreasuryWalletAccount = _developerTreasuryWalletAccount;
        jouelTokenRewardPerBlock = _jouelTokenRewardPerBlock;
        startBlock = _startBlock;
        BONUS_MULTIPLIER = _multiplier;

        poolInfo.push(
            PoolInfo({
                lpToken: _jwlx,
                allocPoint: _allocPoint,
                lastRewardBlock: startBlock,
                rewardTokenPerShare: 0
            })
        );
        totalAllocation = _allocPoint;
    }

    modifier validatePool(uint256 _pid) {
        require(_pid < poolInfo.length, "INVALID_POOL_ID");
        _;
    }

    function updateMultiplier(uint256 multiplierNumber) public onlyOwner {
        BONUS_MULTIPLIER = multiplierNumber;
    }

    function updateStartBlock(uint256 _startBlock) public onlyOwner {
        startBlock = _startBlock;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    function checkPoolDuplicate(IJWLX _lpToken) public view {
        uint256 length = poolInfo.length;
        for (uint256 _pid = 0; _pid < length; _pid++) {
            require(poolInfo[_pid].lpToken != _lpToken, "LIQUIDITY_POOL_TOKEN_ALREADY_EXISTS");
        }
    }

    function add(
        uint256 _allocPoint,
        IJWLX _lpToken,
        bool _withUpdate
    ) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        checkPoolDuplicate(_lpToken);
        uint256 lastRewardBlock = block.number > startBlock
            ? block.number
            : startBlock;
        totalAllocation = Snippets.mathAdd(totalAllocation, _allocPoint);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                rewardTokenPerShare: 0
            })
        );
        updateStakingPool();
    }

    function set(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 prevAllocPoint = poolInfo[_pid].allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
        if (prevAllocPoint != _allocPoint) {
            totalAllocation = Snippets.mathSubAdd(
                totalAllocation,
                prevAllocPoint,
                _allocPoint
            );
            updateStakingPool();
        }
    }

    function updateStakingPool() internal {
        uint256 length = poolInfo.length;
        uint256 points = 0;
        for (uint256 pid = 1; pid < length; ++pid) {
            points = points + (poolInfo[pid].allocPoint);
        }
        if (points != 0) {
            points = points / (3);
            totalAllocation = Snippets.mathSubAdd(
                totalAllocation,
                poolInfo[0].allocPoint,
                points
            );
            poolInfo[0].allocPoint = points;
        }
    }

    function getMultiplier(
        uint256 _from,
        uint256 _to
    ) public view returns (uint256) {
        return Snippets.mathSubMul(_to, _from, BONUS_MULTIPLIER);
    }

    function pendingReward(
        uint256 _pid,
        address _user
    ) external returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 rewardTokenPerShare = pool.rewardTokenPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(
                pool.lastRewardBlock,
                block.number
            );
            uint256 tokenReward = Snippets.mathMulDiv(
                (multiplier * jouelTokenRewardPerBlock),
                pool.allocPoint,
                totalAllocation
            );
            rewardTokenPerShare = Snippets.mathDivAdd(
                tokenReward * 10 ** 12,
                lpSupply,
                rewardTokenPerShare
            );
        }

        uint256 reward = Snippets.mathMulSub(
                user.amount,
                ((rewardTokenPerShare / 10) * 10 ** 12),
                user.pendingReward
            );

        emit PendingReward(block.number, pool.lastRewardBlock, lpSupply, reward, user.amount, ((rewardTokenPerShare / 10) * 10 ** 12), user.pendingReward);

        return reward;
            
    }

    function massUpdatePools() public {
        uint256 pLength = poolInfo.length;
        for (uint256 pid; pid < pLength; ++pid) {
            updatePool(pid);
        }
    }

    function updatePool(uint256 _pid) public validatePool(_pid) {

        PoolInfo storage pool = poolInfo[_pid];

        if (block.number <= pool.lastRewardBlock) {
            return;
        }

        uint256 lpSupply = pool.lpToken.balanceOf(address(this));

        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }

        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);

        uint256 tokenReward = Snippets.mathMulDiv(
            (multiplier * jouelTokenRewardPerBlock),
            pool.allocPoint,
            totalAllocation
        );

        jwlx.mint(developerTreasuryWalletAccount, Snippets.mathDiv(tokenReward, 10));

        jwlx.mint(address(jwlx), tokenReward);

        pool.rewardTokenPerShare = Snippets.mathAddDiv(
            pool.rewardTokenPerShare,
            (tokenReward * 10 ** 12),
            lpSupply
        );

        pool.lastRewardBlock = block.number;

    }

    function stake(uint256 _pid, uint256 _amount) public validatePool(_pid) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending = Snippets.mathMulSub(
                user.amount,
                (pool.rewardTokenPerShare / (10 ** 12)),
                user.pendingReward
            );
            if (pending > 0) {
                safeJWLXTransfer(msg.sender, pending);
            }
        }
        if (_amount > 0) {
        
            pool.lpToken.transferFrom(
                address(msg.sender),
                address(this),
                _amount
            );
            user.amount = Snippets.mathAdd(user.amount, _amount);
        }
        user.pendingReward = Snippets.mathMulDiv(
            user.amount,
            pool.rewardTokenPerShare,
            (10 ** 12)
        );
        emit Deposit(msg.sender, _pid, _amount);
    }

    function unstake(uint256 _pid, uint256 _amount) public validatePool(_pid) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "INSUFFICIENT_FUNDS");
        updatePool(_pid);
        uint256 pending = Snippets.mathMulSub(
            user.amount,
            (pool.rewardTokenPerShare / (10 ** 12)),
            user.pendingReward
        );
        if (pending > 0) {
            safeJWLXTransfer(msg.sender, pending);
        }
        if (_amount > 0) {
            user.amount = Snippets.mathSub(user.amount, _amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.pendingReward = Snippets.mathMulDiv(
            user.amount,
            pool.rewardTokenPerShare,
            (10 ** 12)
        );
        emit Withdraw(msg.sender, _pid, _amount);
    }

    function autoCompound() public {
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][msg.sender];
        updatePool(0);
        if (user.amount > 0) {
            uint256 pending = Snippets.mathMulSub(
                user.amount,
                (pool.rewardTokenPerShare / (10 ** 12)),
                user.pendingReward
            );
            if (pending > 0) {
                user.amount = Snippets.mathAdd(user.amount, pending);
            }
        }
        user.pendingReward = Snippets.mathMulDiv(
            user.amount,
            pool.rewardTokenPerShare,
            (10 ** 12)
        );
    }

    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.pendingReward = 0;
    }

    function getPoolInfo(
        uint256 _pid
    )
        public
        view
        returns (
            address lpToken,
            uint256 allocPoint,
            uint256 lastRewardBlock,
            uint256 rewardTokenPerShare
        )
    {
        return (
            address(poolInfo[_pid].lpToken),
            poolInfo[_pid].allocPoint,
            poolInfo[_pid].lastRewardBlock,
            poolInfo[_pid].rewardTokenPerShare
        );
    }

    function getPools()
        public
        view
        returns(
            PoolInfo[] memory
        )
    {

        return poolInfo;

    }

    function safeJWLXTransfer(address _to, uint256 _amount) internal {
        jwlx.mint(_to, _amount);
        //jwlx.safeJWLXTransfer(_to, _amount);
    }

    function changeDev(address _developerTreasuryWalletAccount) public {
        require(msg.sender == developerTreasuryWalletAccount, "NOT_AUTHORIZED");
        developerTreasuryWalletAccount = _developerTreasuryWalletAccount;
    }
}
