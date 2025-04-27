sudo killall wpa_supplicant
sudo wpa_supplicant -B -iwlan0 -Dnl80211 -c ./p2p.conf
sudo wpa_cli -iwlan0 p2p_group_add
# sudo ifconfig p2p-wlan0-0 192.168.1.2
# sudo wpa_cli -ip2p

